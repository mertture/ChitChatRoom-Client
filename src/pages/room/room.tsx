import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import React from "react";

import RoomType from "../../models/room/room";
import User from "../../models/user/user";


const Room: React.FC = () => {


  const { id: roomId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomType | null>(null);
  const [participants, setParticipants] = useState<Array<User> | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:8080/ws/room/${roomId}`);
    setSocket(newSocket);
  }, [roomId]);

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
          console.log("fetch rooms:", response);
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

    if (token && roomId && socket && user) {
        console.log("isCONNECTED?")
        socket.onopen = () => {
          console.log("connected");
          socket.send(JSON.stringify({
            message: "new participant joined",
            participant: user.id,
          }))
        };
    
        socket.onmessage = (e) => {
          if (e.data.message === "new participant joined") {
            console.log('new participant joined', e.data.participant);
            setParticipants((prevParticipants) =>
              prevParticipants ? [...prevParticipants, e.data.participant] : [e.data.participant]
            );
          }
          else if (e.data.message === "participant left") {
            console.log('participant left', e.data.participant);
            setParticipants((prevParticipants) =>
              prevParticipants
                ? prevParticipants.filter((p) => p.id !== e.data.participant.id)
                : []
            );
          }
        };
    
        return () => {
          socket.close()
        }
    }
  }, [token, roomId, socket, user]);

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
              <div style={{ fontWeight: "bold" }}>aa{participant.name}</div>
              {/* Other room information goes here */}
            </div>
          ))}
        </div>
      )
        :
        "There is only you"
      }

    </div>
  );
};

export default Room;