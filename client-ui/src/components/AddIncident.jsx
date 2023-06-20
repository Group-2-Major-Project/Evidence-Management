import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  PageHeader,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import React, { createContext, useState } from "react";
import generateChallan from "../services/challan";
import EmpService from "../services/employeeApi";
export const formValuesContext = createContext(null);
const FormItem = Form.Item;
const Option = Select.Option;

const AddIncident = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  var f = {};
  const addEmployee = async (values) => {
    f["jobTitle"] = values.jobTitle;
    f["empID"] = values.empID;
    f["first"] = values.firstName;
    f["last"] = values.lastName;
    f["phone"] = values.phone;
    f["address"] = values.address;
    setFormValues(f);
    try {
      setLoading(true);
      let resp = await EmpService.AddNewEmployee(values);
      const respJSON = JSON.parse(resp);

      if (respJSON.status === "ERROR") {
        message.error(respJSON.description);
      } else if (respJSON.success === false) {
        message.error(respJSON.message);
      } else {
        message.success(respJSON.description);
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
      generateChallan(
        values.jobTitle,
        values.empID,
        values.firstName,
        values.lastName,
        values.phone,
        values.address,
        fileList[0].name
      );
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
    <formValuesContext.Provider value={formValues}>
      <PageHeader className="site-page-header" title="Add new incident" />
      <Row type="flex" justify="center" align="middle" className="form-wrapper">
        <Form
          autoComplete="off"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={addEmployee}
          onFinishFailed={(error) => {
            console.log({ error });
          }}
        >
          <FormItem
            name="jobTitle"
            label="Incident type"
            rules={[
              {
                required: false,
                message: "Please select incident type",
              },
            ]}
          >
            <Select
              style={{ width: "100%", textAlign: "left" }}
              placeholder="Select your incident type"
            >
              <Option value="Traffic Accident">Traffic Accident</Option>
              <Option value="Traffic Violation" selected>
                Traffic Violation
              </Option>
            </Select>
          </FormItem>
          <FormItem
            name="empID"
            label="Vehicle No."
            rules={[
              {
                required: true,
                message: "Please enter the vehicle number",
              },
              { message: "Please enter the vehicle number" },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter the vehicle number" />
          </FormItem>
          <FormItem
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please enter first name",
              },
              { type: "text", message: "Please enter first name" },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter first name" />
          </FormItem>

          <FormItem
            name="lastName"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please enter last name",
              },
              { type: "text", message: "Please enter last name" },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter last name" />
          </FormItem>
          <FormItem
            name="phone"
            label="Mobile No."
            rules={[
              {
                required: false,
              },
              { message: "Please enter a valid mobile number" },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter your mobile number" />
          </FormItem>
          <FormItem
            name="address"
            label="Address"
            rules={[
              {
                required: false,
              },
              { type: "text", message: "Please enter address" },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter address" />
          </FormItem>
          <FormItem label="Upload image" hasFeedback>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="save-btn"
            >
              Save
            </Button>
          </FormItem>
        </Form>
      </Row>
    </formValuesContext.Provider>
  );
};

export default AddIncident;
