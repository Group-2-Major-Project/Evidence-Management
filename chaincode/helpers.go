package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Response struct {
	Status      string `json:"status"`
	Description string `json:"description"`
	ObjectBytes string `json:"objectBytes"`
}

// Function to unmarshall 
func JSONtoObject(data []byte, object interface{}) error {
	if err := json.Unmarshal([]byte(data), object); err != nil {
		return err
	}
	return nil
}

// Function to marshall object
func ObjecttoJSON(object interface{}) ([]byte, error) {
	var byteArray []byte
	var err error

	if byteArray, err = json.Marshal(object); err != nil {
		return nil, err
	}

	if len(byteArray) == 0 {
		return nil, fmt.Errorf(("failed to convert object")) 
	}
	return byteArray, nil
}

func BuildResponse(status string, description string, objBytes []byte) Response {
	var msg = &Response{}
	msg.Status = status
	msg.Description = description
	if len(objBytes) == 0 {
		objBytes = []byte("")
	}
	msg.ObjectBytes = string(objBytes)
	return *msg
}

// getCollectionName is a helper function to get collection of submitting client identity.
func getCollectionName(ctx contractapi.TransactionContextInterface) (string, error) {

	// Get the MSP ID of submitting client identity
	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return "", fmt.Errorf("failed to get verified MSPID: %v", err)
	}

	// Create the collection name
	orgCollection := clientMSPID + "PrivateCollection"

	return orgCollection, nil
}