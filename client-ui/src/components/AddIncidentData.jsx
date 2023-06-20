import {
  Button,
  DatePicker,
  Form,
  Input,
  PageHeader,
  Row,
  Select,
  message,
} from "antd";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import EmpService from "../services/employeeApi";

const moment = require("moment");
const FormItem = Form.Item;
const Option = Select.Option;

const AddIncidentData = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const addEmpPvtData = async (values) => {
    try {
      setLoading(true);
      values = {
        ...values,
        empID: location.state.empid,
        dob: moment(values.dob).format("YYYY-MM-DD"),
        isPrivate: true,
      };

      const formData = await getUploadedFiles();

      formData.append("params", JSON.stringify(values));

      let resp = await EmpService.AddPrivateDetails(formData);

      const respJSON = JSON.parse(resp);
      if (respJSON.status === "ERROR") {
        message.error(respJSON.description);
      } else {
        message.success(respJSON.description);
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUploadedFiles = async () => {
    var i = 0;
    const formData = new FormData();
    try {
      return new Promise(async (res, rej) => {
        for (i; i < fileList.length; i++) {
          var file = fileList[i];
          formData.append("file", file);
        }
        if (i === fileList.length) {
          return res(formData);
        }
      });
    } catch (err) {
      message.error(err.message);
      return err.message;
    }
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <>
      <PageHeader className="site-page-header" title="Add Incident Details" />
      <Row type="flex" justify="center" align="middle">
        <Form
          autoComplete="off"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          onFinish={addEmpPvtData}
          onFinishFailed={(error) => {
            console.log({ error });
          }}
        >
          <FormItem label="Vehicle No." hasFeedback>
            <Input placeholder={location.state.empid} disabled="true" />
          </FormItem>
          <FormItem
            name="idType"
            label="National ID"
            rules={[
              {
                required: true,
                message: "Please select National ID",
              },
            ]}
          >
            <Select
              style={{ width: "100%", textAlign: "left" }}
              placeholder="Select your National ID"
            >
              <Option value="Aadhar">Aadhar</Option>
              <Option value="Passport">Passport</Option>
              <Option value="SSN" selected>
                SSN
              </Option>
              <Option value="Personalausweis">Personalausweis</Option>
              <Option value="Emirates ID card">Emirates ID card</Option>
            </Select>
          </FormItem>
          <FormItem
            name="nationalID"
            label="ID Number"
            rules={[
              {
                required: true,
                message: "Please enter National ID",
              },
              { message: "Please enter National ID" },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter your National ID" />
          </FormItem>
          <FormItem
            name="dob"
            label="Date of Birth"
            rules={[
              {
                required: true,
                message: "Please enter date of birth",
              },
            ]}
            hasFeedback
          >
            <DatePicker
              style={{ width: "100%" }}
              picker="date"
              format="YYYY-MM-DD"
              showTime={false}
              placeholder="Chose date of birth"
            />
          </FormItem>
          <FormItem wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </FormItem>
        </Form>
      </Row>
    </>
  );
};

export default AddIncidentData;
