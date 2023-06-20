import {
    API_ADD_EMPLOYEE, HTTP_HEADER, API_GET_ALL_EMPLOYEES,
    API_GET_EMP_DETAILS, API_ADD_PRIVATE_DATA, API_GET_EMP_PVT_DATA, HTTP_HEADER_FORMDATA,
    API_GET_EMP_IPFS_FILE, API_DELETE_EMP
} from './Constants.js';

const AddNewEmployee = async (employee) => {
    try {
        const resp = await fetch(API_ADD_EMPLOYEE, {
            headers: HTTP_HEADER(),
            method: 'POST',
            body: JSON.stringify(employee),
        })
        const empstr = await resp.text()
        return empstr
    } catch (error) {
        return error;
    }
}

const GetEmployeeList = async () => {
    try {
        const resp = await fetch(API_GET_ALL_EMPLOYEES, {
            headers: HTTP_HEADER(),
            method: 'GET',
        })
        const empstr = await resp.text()
        return empstr
    } catch (error) {
        return error;
    }
}

const GetEmpDetails = async (empID) => {
    try {
        const resp = await fetch(API_GET_EMP_DETAILS, {
            headers: HTTP_HEADER(),
            method: 'POST',
            body: JSON.stringify({ empID }),
        })
        const empstr = await resp.text()
        return empstr
    } catch (error) {
        return error;
    }
}

const DeleteEmployee = async (empID) => {
    try {
        const resp = await fetch(API_DELETE_EMP, {
            headers: HTTP_HEADER(),
            method: 'POST',
            body: JSON.stringify({ empID }),
        })
        const empstr = await resp.text()
        return empstr
    } catch (error) {
        return error;
    }
}

const AddPrivateDetails = async (privateData) => {
    try {
        // privateData.isPrivate = true;
        const resp = await fetch(API_ADD_PRIVATE_DATA, {
            headers: HTTP_HEADER_FORMDATA(),
            method: 'POST',
            body: privateData,
        })
        const empstr = await resp.text()
        return empstr
    } catch (error) {
        return error;
    }
}

const GetEmpPvtRecords = async (empID) => {
    try {
        const resp = await fetch(API_GET_EMP_PVT_DATA, {
            headers: HTTP_HEADER(),
            method: 'POST',
            body: JSON.stringify({ empID }),
        })
        const empstr = await resp.text()
        return empstr
    } catch (error) {
        return error;
    }
}

const GetIpfsFile = async (props) => {
    try {
        const resp = await fetch(API_GET_EMP_IPFS_FILE, {
            headers: HTTP_HEADER(),
            method: 'POST',
            body: JSON.stringify({ props }),

        })
        var buffer = await resp.arrayBuffer();
        return buffer;
    } catch (error) {
        return error;
    }
}



export default {
    AddNewEmployee,
    GetEmployeeList,
    GetEmpDetails,
    DeleteEmployee,
    AddPrivateDetails,
    GetEmpPvtRecords,
    GetIpfsFile
}