import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Typography } from 'antd';
import axios from "axios";
import { useNavigate } from "react-router";

import EnterRoomReqBody from '../../models/room/enterRoomReqBody';

import Room from "../../models/room/room";

interface RoomFormProps {
  room: Room;
}

const RoomModal: React.FC<RoomFormProps> = ({ room }) => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<boolean>(true);
  const [form] = Form.useForm();

  const navigate = useNavigate();


  const onFinish = async (values: EnterRoomReqBody) => {
    if (token && room) {
      try {
        setResult(false);
        await axios.post(`http://localhost:8080/api/room/${room.id}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate(`/room/${room.id}`);
        setResult(true);
      } catch (error: any) {
        setError(error.response.data.error);
        setResult(true);
        console.error(error);
      }
    }
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
    setResult(true);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, [])


  return (

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
        initialValues={EnterRoomReqBody.create({ password: '' })}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="password"
          rules={[{ validator: EnterRoomReqBody.validator('password') }]}
        >
          <Input.Password placeholder="Enter room password" />
        </Form.Item>
        <Form.Item>
          <Button loading={!result} block htmlType="submit">
            Enter
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default RoomModal;

