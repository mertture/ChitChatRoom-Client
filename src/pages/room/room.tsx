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
  //const [socket, setSocket] = useState<WebSocket | null>(null);

  // useEffect(() => {
  //   const newSocket = new WebSocket(`ws://localhost:8080/ws/room/${roomId}`);
  //   setSocket(newSocket);
  // }, [roomId]);

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
          console.log(response);
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
    let socket: WebSocket | null = null;

    const connectSocket = () => {
      socket = new WebSocket(`ws://localhost:8080/ws/room/${roomId}`);
      if (socket) {
        socket.onopen = () => {
          console.log("connected");
          socket!.send(
            JSON.stringify({
              message: "new participant joined",
              participant: user!.id,
            })
          );
        };
  
        socket.onmessage = (e) => {
          const data = JSON.parse(e.data);
  
          if (data.message === "new participant joined") {
            console.log("new participant joined", data.participant);
            setParticipants((prevParticipants) =>
              prevParticipants
                ? [...prevParticipants, data.participant]
                : [data.participant]
            );
          } else if (data.message === "participant left") {
            console.log("participant left", data.participant);
            setParticipants((prevParticipants) =>
              prevParticipants
                ? prevParticipants.filter((p) => p.id !== data.participant)
                : []
            );
          }
        };
  
        socket.onclose = () => {
          console.log("disconnected");
          socket!.send(
            JSON.stringify({
              message: "participant left",
              participant: user!.id,
            })
          );
          setTimeout(connectSocket, 10000); // retry after 10 second
        };
      }
    };

    if (token && roomId && user) {
      connectSocket();
    }

    return () => {
      if (socket) {
        socket!.send(
          JSON.stringify({
            message: "participant left",
            participant: user!.id,
          })
        );
        socket.close();
      }
    };
  }, [token, roomId, user]);

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
      {participants !== null ? (
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