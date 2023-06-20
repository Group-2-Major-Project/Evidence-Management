import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Checkbox, Button, Row, PageHeader, message } from 'antd';
import UserService from '../services/userApi';
const FormItem = Form.Item;
const Option = Select.Option;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const Register = async (values) => {
    try {
      setLoading(true);
      let resp = await UserService.CreateNewUser(values)
      if (resp.toLowerCase().includes('error')) {
        message.error(resp);
      } else {
        navigate("/Login");
      }
    } catch (error) {
      message(error.message);
    } finally{
      setLoading(false);
    }

  }
  
  return (
    <>
      <PageHeader className='site-page-header' title='Register' subTitle='your details' />
      <Row type="flex" justify="center" align="middle">

        <Form
          autoComplete="off"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}

          onFinish={Register}

          onFinishFailed={(error) => {
            console.log({ error });
          }}
        >
          <FormItem
            name="userID"
            label="E-mail"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
              { type: "email", message: "Please enter a valid email" },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter your Email" />
          </FormItem>
          <FormItem
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
              { min: 6 },
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject("Password does not match criteria."),
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Enter your password" />
          </FormItem>
          <FormItem
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "The two passwords that you entered does not match."
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Confirm your password" />
          </FormItem>
          <FormItem
            name="phone"
            label="Mobile Number"
            rules={[
              {
                required: false,
                message: "Please enter your email",
              },
              { message: "Please enter a valid Mobile number" },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter your Mobile number" />
          </FormItem>
          <FormItem
            name="org"
            label="Select Organization"
            rules={[
              {
                required: true,
                message: 'Please select your organization!',
              },
            ]}
          >
            <Select style={{ width: '100%', textAlign:'left' }}
              placeholder="Select your organization">
              <Option value="motorvehicledepartment">motorvehicledepartment</Option>
              <Option value="licinsurance">licinsurance</Option>
              <Option value="bajajinsurance">bajajinsurance</Option>
              <Option value="benzmanufacturer">benzmanufacturer</Option>

            </Select>
          </FormItem>
          <FormItem
            name="agreement"
            wrapperCol={{ span: 24 }}
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                      "To proceed, you need to agree with our terms and conditions"
                    ),
              },
            ]}
          >
            <Checkbox>
              {" "}
              Agree to our <a href="#">Terms and Conditions</a>
            </Checkbox>
          </FormItem>
          <FormItem wrapperCol={{ span: 24 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Register
            </Button>
          </FormItem>
        </Form>
      </Row>
    </>
  )
}

export default Signup;

