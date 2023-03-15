import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import axios from "axios";
import Room from "../../models/room/room";
import User from "../../models/user/user";




const Dashboard: React.FC = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Array<Room> | null>(null);

  const goToCreateRoom = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/createroom")
  }

  const goToRoom = (e: any, roomId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("room:", roomId);
    navigate(`/room/${roomId}`)
  }


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

  const fetchRooms = async () => {
    try {
      if (token) {
        const response = await axios.get("http://localhost:8080/api/rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("fetch rooms:", response);
        setRooms(response.data);
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
    fetchRooms();
  }, [token]);

  return (
    <div>
      {user !== null ?
        <h1>Welcome, {user.email}!</h1>
        :
        ""
      }
      {rooms !== null ?
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {rooms.map((room) => (
            <button key={room.id}
              style={{ marginRight: '20px', marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}
              onClick={(e) => goToRoom(e, room.id)}>
              <div style={{ fontWeight: 'bold' }}>{room.name}</div>
              {/* Other room information goes here */}
            </button>
          ))}
        </div>
        :
        "There are no rooms"
      }

      <div className="col-2 align-self-center level-btn">
        <button className="btn btn-primary btn-md" onClick={(e) => goToCreateRoom(e)}>
          Create Room
        </button>
      </div>

    </div>
  );
};

export default Dashboard;