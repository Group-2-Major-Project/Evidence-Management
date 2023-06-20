import { Descriptions, message, PageHeader, List, Divider } from "antd";
import { FileOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EmployeeService from '../services/employeeApi';

const ShowIncidentData = () => {
    const location = useLocation();
    const [empPvtData, setEmpPvtData] = useState(null);
    const [uploadedDocs, setUploadedDocs] = useState(null)
    const navigate = useNavigate();

    const loadData = async () => {
        try {
            let resp = await EmployeeService.GetEmpPvtRecords(location.state.empid);
            const rep_json = JSON.parse(resp);
            if (rep_json.status === 'SUCCESS') {
                const pvtData = JSON.parse(rep_json.objectBytes);
                setEmpPvtData(pvtData);
                if (pvtData.ImageUrl) {
                    setUploadedDocs(JSON.parse(pvtData.ImageUrl));
                }

            } else {
                message.error('Sorry, unable to load the employee personal details.');
                navigate("/employeelist");
            }

        } catch (err) {
            message.error(err.message);
        }
    }

    useEffect(() => {
        loadData();
    })

    const getFileFromIPFS = async (cid, filename, mimetype) => {
        let resp = await EmployeeService.GetIpfsFile({ cid, mimetype });
        var bytes = new Uint8Array(resp);
        var blob = new Blob( [ bytes ], { type: mimetype } );
        var image = URL.createObjectURL(blob)
        window.open(image,filename,'width=800, height=600');
    }

    if (empPvtData) {
        return (
            <>
                <PageHeader className='site-page-header' title='Incident Info' style={{justifyContent:'center'}}/>
                <Divider orientation="middle" style={{fontWeight:600}}>Personal details</Divider>
                <Descriptions style={{padding:'0 126px'}} >
                    <Descriptions.Item label="Vehicle No.">{location.state.empid}</Descriptions.Item>
                    <Descriptions.Item label="National ID">{empPvtData.idType}</Descriptions.Item>
                    <Descriptions.Item label="ID Number">{empPvtData.nationalID}</Descriptions.Item>
                    <Descriptions.Item label="Date of Incident">{empPvtData.Dob}</Descriptions.Item>
                </Descriptions>
                <Divider orientation="middle" style={{fontWeight:600}}>Documents uploaded</Divider>
                {
                    uploadedDocs != null &&
                    <List
                        itemLayout="horizontal"
                        dataSource={uploadedDocs}
                        style={{marginLeft: '-95px'}}
                        renderItem={item => (
                            <List.Item onClick={() => {
                                getFileFromIPFS(item.value, item.name, item.mimetype)
                            }}>
                                <List.Item.Meta
                                avatar={<FileOutlined />}
                                    title={<span style={{whiteSpace:'nowrap', cursor:'pointer'}}>{item.name}</span>}
                                />
                            </List.Item>
                        )}
                    />
                }
            </>
        )
    }
}

export default ShowIncidentData;