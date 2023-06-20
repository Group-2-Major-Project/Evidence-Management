import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, Checkbox, Select, Row, PageHeader, message } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import UserService from '../services/userApi';

const FormItem = Form.Item;
const Option = Select.Option;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const doLogin = async (values) => {
    try {
      setLoading(true);
      let resp = await UserService.Login(values)
      if (resp.toLowerCase().includes('error')) {
        message.error(resp);
      } else {
        message.success('Successfully logged in.')
      }
    } catch (error) {
      message(error.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <PageHeader className='site-page-header' title='Login' />
      <Row type="flex" justify="center" align="middle">
        <Form
          name="login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={doLogin}
        >
          <div className='login-items'>
            <FormItem
              name="userID"
              rules={[
                {
                  required: true,
                  message: 'Please input your Username!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                // type="email"
                placeholder="Username" />
            </FormItem>
            <FormItem
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </FormItem>
            <FormItem
              name="org"
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
            <FormItem>
              <FormItem name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </FormItem>

              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </FormItem>

            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                Log in
              </Button>
              Or <Link to='/signup'>register now!</Link>
            </FormItem>
          </div>
        </Form>
      </Row>
    </>
  );
};

export default Login

