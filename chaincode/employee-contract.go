package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

const empPrefix = "EMP"

// SmartContract of this fabric sample
type SmartContract struct {
	contractapi.Contract
}

// AddEmployee issues a new employee to the world state with given details.
func (s *SmartContract) AddEmployee(ctx contractapi.TransactionContextInterface, args string) Response {
	employee := &Employee{}
	err := JSONtoObject([]byte(args), employee)

	empKey, err := ctx.GetStub().CreateCompositeKey(empPrefix, []string{employee.EmpID})

	isEmpExists, err := s.EmployeeExists(ctx, employee.EmpID)
	if isEmpExists {
		return BuildResponse("ERROR", fmt.Sprintf("Incident record already exists in the blockchain"), nil)
	}
	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Failed to add new Incident record to the blockchain"), nil)
	}

	objEmpBytes, err := ObjecttoJSON(employee)
	err = ctx.GetStub().PutState(empKey, objEmpBytes)
	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Failed to add new incident record to the blockchain"), nil)
	}
	return BuildResponse("SUCCESS", fmt.Sprintf("New incident record added to the blockchain successfully."), nil)

}

// EmployeeExists returns true when employee with given EmpId exists in world state
func (s *SmartContract) EmployeeExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	empKey, err := ctx.GetStub().CreateCompositeKey(empPrefix, []string{id})
	employeeJSON, err := ctx.GetStub().GetState(empKey)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return employeeJSON != nil, nil
}

// ReadEmployee returns the employee stored in the world state with given id.
func (s *SmartContract) ReadEmployee(ctx contractapi.TransactionContextInterface, args string) Response {
	employee := &Employee{}
	err := JSONtoObject([]byte(args), employee)

	empKey, err := ctx.GetStub().CreateCompositeKey(empPrefix, []string{employee.EmpID})
	employeeBytes, err := ctx.GetStub().GetState(empKey)

	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Failed to read incident data from the blockchain"), nil)
	}
	if employeeBytes == nil {
		return BuildResponse("ERROR", fmt.Sprintf("The incident %s does not exist", employee.EmpID), nil)
	}
	return BuildResponse("SUCCESS", "", employeeBytes)
}

// UpdateEmployee updates an existing employee in the world state with provided parameters.
func (s *SmartContract) UpdateEmployee(ctx contractapi.TransactionContextInterface, args string) Response {
	employee := &Employee{}
	err := JSONtoObject([]byte(args), employee)
	
	empKey, err := ctx.GetStub().CreateCompositeKey(empPrefix, []string{employee.EmpID})

	objEmpBytes, err := ObjecttoJSON(employee)
	err = ctx.GetStub().PutState(empKey, objEmpBytes)
	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Failed to update incident record in the blockchain"), nil)
	}
	return BuildResponse("SUCCESS", fmt.Sprintf("Incident record updated in the blockchain successfully."), nil)
}

// GetAllEmployees returns all employees found in world state
func (s *SmartContract) GetAllEmployees(ctx contractapi.TransactionContextInterface) Response {
	resultsIterator, err := ctx.GetStub().GetStateByPartialCompositeKey(empPrefix, []string{})
	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Failed to read incident data from the blockchain"), nil)
	}
	defer resultsIterator.Close()

	var employees []*Employee
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return BuildResponse("ERROR", fmt.Sprintf("Failed to read incident data from the blockchain"), nil)
		}

		var employee Employee
		err = json.Unmarshal(queryResponse.Value, &employee)
		if err != nil {
			return BuildResponse("ERROR", fmt.Sprintf("Failed to read incident data from the blockchain"), nil)
		}
		employees = append(employees, &employee)
	}
	employeeBytes, err := ObjecttoJSON(employees)
	return BuildResponse("SUCCESS", "", employeeBytes)
}

// DeleteEmployee deletes a given employee from the world state.
func (s *SmartContract) DeleteEmployee(ctx contractapi.TransactionContextInterface, args string) Response {
	employee := &Employee{}
	err := JSONtoObject([]byte(args), employee)

	empKey, err := ctx.GetStub().CreateCompositeKey(empPrefix, []string{employee.EmpID})

	employeeBytes, err := ctx.GetStub().GetState(empKey)

	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Failed to read incident data from the blockchain"), nil)
	}
	if employeeBytes == nil {
		return BuildResponse("ERROR", fmt.Sprintf("The incident %s does not exist", employee.EmpID), nil)
	}

	err = ctx.GetStub().DelState(empKey)
	if err != nil {
		return BuildResponse("ERROR", fmt.Sprintf("Failed to delete incident record from the blockchain"), nil)
	}
	return BuildResponse("SUCCESS", "Incident record deleted successfully.", nil)

}

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create incident details chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting incident details chaincode: %s", err.Error())
	}
}
