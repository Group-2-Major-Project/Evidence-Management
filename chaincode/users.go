package main

import (
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

const userPrefix = "USER"

func (c *SmartContract) CreateUser(ctx contractapi.TransactionContextInterface, args string) Response {
	user := &User{}
	err := JSONtoObject([]byte(args), user)

	userKey, err := ctx.GetStub().CreateCompositeKey(userPrefix, []string{user.UserID})

	objUserBytes, err := ObjecttoJSON(user)

	err = ctx.GetStub().PutState(userKey, objUserBytes)
	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("failed to add new user record to blockchain"), nil)
	}
	return BuildResponse("SUCCESS", fmt.Sprintf("New user record added to the blockchain successfully."), nil)
}


func (c *SmartContract) GetUserDetails(ctx contractapi.TransactionContextInterface, args string) Response {
	
	userKey, err := ctx.GetStub().CreateCompositeKey(userPrefix, []string{args})

	userBytes, err := ctx.GetStub().GetState(userKey)
	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("failed to Read user details from the ledger"), nil)
	}

	return BuildResponse("SUCCESS", "", userBytes)
}