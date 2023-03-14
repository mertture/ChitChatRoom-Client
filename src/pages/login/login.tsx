import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Typography } from 'antd';
import LoginRegisterReqBody from '../../models/user/loginRegisterReqBody';
import axios from "axios";

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<boolean>(true);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const onFinish = async (values: LoginRegisterReqBody) => {
    try {
      setResult(false);
      const response = await axios.post("http://localhost:8080/api/user/login", values);
      console.log(response);
      localStorage.setItem("token", response.data);
      navigate("/dashboard");
      setResult(true);
    } catch (error: any) {
      setError(error.response.data.error);
      setResult(true);
      console.error(error);
    }
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
    setResult(true);
  }

  return (

    <div
      className="center-column"
      style={{
        backgroundImage:
          'url(https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?w=2000)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <Card className="elevation" style={{ width: '100%', maxWidth: 300 }}>
        <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 20 }}>
          {error !== null ? (
            <span style={{ color: 'red' }}>{error}</span>
          ) : ""
          }
        </Typography.Title>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          style={{ width: '100%' }}
          initialValues={LoginRegisterReqBody.create({ email: '', password: '' })}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[{ validator: LoginRegisterReqBody.validator('email') }]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ validator: LoginRegisterReqBody.validator('password') }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button loading={!result} block htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;