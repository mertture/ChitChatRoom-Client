import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import axios from "axios";
import RoomType from "../../models/room/room";
import User from "../../models/user/user";

const Room: React.FC = () => {

  const navigate = useNavigate();
  const { roomId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomType | null>(null);
  const [participants, setParticipants] = useState<Array<User> | null>(null);

  const fetchUser = async () => {
    try {
      if (token) {
        const response = await axios.get("http://localhost:8080/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setUser(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoom = async () => {
    try {
      if (token) {
        const response = await axios.get(`http://localhost:8080/api/room/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("fetch rooms:", response);
        setRoom(response.data);
        setParticipants(response.data.participants);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, [])

  useEffect(() => {
    fetchUser();
    fetchRoom();
  }, [token]);

  return (
    <div>
      {room !== null ?
        <h1>Welcome to room, {room.name}!</h1>
        :
        ""
      }
      {participants !== null ?
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {participants.map((participant) => (
            <div key={participant.id}
              style={{ marginRight: '20px', marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <div style={{ fontWeight: 'bold' }}>{participant.name}</div>
              {/* Other room information goes here */}
            </div>
          ))}
        </div>
        :
        "There is only you"
      }

    </div>
  );
};

export default Room;