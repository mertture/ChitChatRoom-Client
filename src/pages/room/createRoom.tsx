import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Typography } from 'antd';
import CreateRoomReqBody from '../../models/room/createRoomReqBody';
import axios from "axios";

const CreateRoom: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  const [form] = Form.useForm()

  const navigate = useNavigate();

  const onFinish = async (values: CreateRoomReqBody) => {
    try {
      setResult(false);
      if (token) {
        const response = await axios.post("http://localhost:8080/api/room/create", values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResult(true);
        navigate("/dashboard");
      }
    } catch (error: any) {
      setError(error.response.data.error);
      setResult(true);
      console.error(error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, [])
 

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
          initialValues={CreateRoomReqBody.create({ name: '', password: '' })}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="name"
            rules={[{ validator: CreateRoomReqBody.validator('name') }]}
          >
            <Input type="text" placeholder="Enter room name" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ validator: CreateRoomReqBody.validator('password') }]}
          >
            <Input.Password placeholder="Enter room password" />
          </Form.Item>
          <Form.Item>
            <Button loading={!result} block htmlType="submit">
              Create Room
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateRoom;