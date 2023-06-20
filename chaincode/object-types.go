/*
 * SPDX-License-Identifier: Apache-2.0
 */

package main

// Define structs to be used by chaincode

type User struct {
	UserID    string `json:"userId,required"`
	Name      string `json:"name"`
	Password  string `json:"password,required"`
	Address   string `json:"address"`
	Phone     string `json:"phone"`
	Email     string `json:"email"`
	PaymentID string `json:"paymentID"`
	Timestamp string `json:"timeStamp"`
}

type Employee struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	EmpID        string `json:"empID"`
	JobTitle    string `json:"jobTitle"`
	DOB       string `json:"dob"`
	// BloodGroup string `json:"bloodGroup"`
	Mobile    string `json:"mobile"`
	Address   string `json:"address"`
	Timestamp   string `json:"datetime"`
}

type EmpPrivateData struct {
	EmpID        string `json:"empID"`
	IdType string `json:"idType"`
	NationalID string `json:"nationalID"`
	Dob string `"json:dob"`
	ImageUrl string`"json:imageUrl"`
}