import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, Row, Button, message, PageHeader, Popconfirm } from 'antd';
import EmployeeService from '../services/employeeApi';

const text = 'Are you sure to delete this incident?';

const IncidentList = () => {
    const [empData, setEmpData] = useState(null);
    const [key, setKey] = useState('');
    const [empSelected, setEmpSelected] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const navigate = useNavigate();

    const columns = [
        {
            title: 'Vehicle No.',
            dataIndex: 'empID',
            render: (text) => <button>{text}</button>,
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
        },
        {
            title: 'Incident Type',
            dataIndex: 'jobTitle',
        },
        {
            title: 'Mobile Number',
            dataIndex: 'mobile',
        },
        // {
        //     title: 'Time',
        //     dataIndex: 'datetime'
        // }
    ];

    useEffect(() => {
        loadData();
    }, [deleted])

    const onRowChange = (key) => {
        setEmpSelected(true);
        setKey(key.toString());
    };

    const addIncidentInfo = () => {
        navigate("/incidentdata", { state: { empid: key } })
    }

    const loadData = async () => {
        try {
            let resp = await EmployeeService.GetEmployeeList();
            const rep_json = JSON.parse(resp);
            if (rep_json.status === 'SUCCESS') {
                setEmpData(JSON.parse(rep_json.objectBytes));
            } else {
                message.error('Sorry, unable to load the incident records.')
            }

        } catch (err) {
            message.error(err.message);
        }
    }

    const showIncidentDetails = () => {
        navigate("/showincidentdata", { state: { empid: key } })
    }

    const confirm = () =>
        new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    let resp = await EmployeeService.DeleteEmployee(key);
                    const rep_json = JSON.parse(resp);

                    if (rep_json.status === 'SUCCESS') {
                        message.success(rep_json.description)
                        setEmpSelected(false);
                        setDeleted(!deleted);
                        resolve();
                    } else {
                        message.error(rep_json.description)
                        resolve();
                    }
                } catch (err) {
                    message.error(err.message);
                    resolve();
                }
            }, 0);
        });

    return (
        <>
            <PageHeader className='site-page-header' title='Incidents' subTitle='list of registered incidents' />
            <Row>
                <div>
                    <Table rowSelection={{ type: "radio", onChange: onRowChange }} rowKey={"empID"} columns={columns} dataSource={empData} />
                </div>

            </Row>
            <Row>
                <div className='button'>
                    <Button type="primary" htmlType="button" disabled={!empSelected} onClick={addIncidentInfo}>
                        Add Incident Info
                    </Button>
                </div>
                <div className='button'>
                    <Button type="primary" htmlType="button" disabled={!empSelected} onClick={showIncidentDetails}>
                        Show Incident Details
                    </Button>
                </div>
                <div className='button'>

                    <Popconfirm disabled={!empSelected} title={text} onConfirm={confirm} okText="Yes" cancelText="No">
                        <Button type="primary" disabled={!empSelected} htmlType="button">
                            Remove
                        </Button>
                    </Popconfirm>

                </div>
            </Row>
        </>
    )
}


export default IncidentList;

