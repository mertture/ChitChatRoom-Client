import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import { formatEmail } from "../../utils";
import RoomType from "../../models/room/room";
import User from "../../models/user/user";
import { Button } from "antd";


const Room: React.FC = () => {


  const navigate = useNavigate();
  const { id: roomId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomType | null>(null);
  const [participants, setParticipants] = useState<Array<User> | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const response = await axios.get(
            "http://localhost:8080/api/user/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRoom = async () => {

      try {
        if (token && roomId) {
          const response = await axios.get(
            `http://localhost:8080/api/room/${roomId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setRoom(response.data);
          setParticipants(response.data.participants);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    fetchRoom();
  }, [token, roomId]);

  useEffect(() => {
    if (!socket && user) {
      const newSocket = new WebSocket("ws://localhost:8080/");
  
      newSocket.onopen = () => {
        newSocket.send(JSON.stringify({ action: "join", room: roomId, participant: user.id }));
      };
  
      setSocket(newSocket);
    }
  
    // update the list of users in the room when a new user joins or leaves
    const handleSocketMessage = (e: MessageEvent<any>) => {
      const data = JSON.parse(e.data);
      switch (data.action) {
        case "users":
          setParticipants(data.participants);
      }
    };
    socket?.addEventListener("message", handleSocketMessage);
  
    // leave the room on component unmount
    return () => {
      if (socket && user) {
        socket.send(JSON.stringify({ action: "leave", room: roomId, participant: user.id }));
        socket.close();
      }
    };
  }, [roomId, user, socket]);


  function LeaveRoom() {
    navigate('/dashboard');
  }

  return (
    <div>
      {room !== null ?
        <h1>Welcome to room, {room.name}!</h1>
        :
        ""
      }
      {participants ? (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {participants.map((participant) => (
            <div
              key={participant.id}
              style={{
                marginRight: "20px",
                marginBottom: "20px",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{formatEmail(participant.email)}</div>
              {/* Other room information goes here */}
            </div>
          ))}
        </div>
      )
        :
        "There is only you"
      }
    <Button onClick={LeaveRoom} block>Leave</Button>
    </div>
  );
};

export default Room;