package main

import (
	"fmt"
	"encoding/json"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

const empPvtCollectionName = "empPvtCollection"

func (s *SmartContract) AddPrivateData(ctx contractapi.TransactionContextInterface) Response {
	transientMap, err := ctx.GetStub().GetTransient()
	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Error getting transient"), nil)
	}

	// Private data is passed in transient field, instead of func args
	transientPvtJSON, ok := transientMap["emp_pvt_properties"]
	if !ok {
		return BuildResponse("ERROR", fmt.Sprintf("Private data not found in the transient map input"), nil)
	}

	var empPrivate EmpPrivateData
	err = json.Unmarshal(transientPvtJSON, &empPrivate)

	pvtJSONasBytes, err := json.Marshal(empPrivate)
	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Failed to marshal private data into JSON"), nil)
	}

	ownerCollection, err := getCollectionName(ctx)
	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Failed to Private collection name from the config file"), nil)
	}

	// Save private data collection
	err = ctx.GetStub().PutPrivateData(ownerCollection, empPrivate.EmpID, pvtJSONasBytes)

	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Failed to add Incident private data to the blockchain"), nil)
	}
	return BuildResponse("SUCCESS", fmt.Sprintf("Incident private data added to the blockchain successfully."), nil)

}

func (s *SmartContract) QueryPvtRecordByEmpId(ctx contractapi.TransactionContextInterface, args string) Response {
	pvtObj := &EmpPrivateData{}
	err := JSONtoObject([]byte(args), pvtObj)

	ownerCollection, err := getCollectionName(ctx)
	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Failed to Private collection name from the config file"), nil)
	}

	empPvtBytes, err := ctx.GetStub().GetPrivateData(ownerCollection, pvtObj.EmpID)

	//No Asset found, return empty response
	if empPvtBytes == nil {
		return BuildResponse("ERROR", fmt.Sprintf("%v does not exist in collection %v", pvtObj.EmpID, ownerCollection), nil)
	}

	return BuildResponse("SUCCESS", "", empPvtBytes)

}