import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import axios from "axios";
import Room from "../../models/room/room";
import User from "../../models/user/user";
import RoomModal from "../room/roomModal";




const Dashboard: React.FC = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Array<Room> | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);


  const goToCreateRoom = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/createroom")
  }

  

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
  };

  useEffect(() => {

    const fetchUser = async () => {
      try {
        if (token) {
          const response = await axios.get("http://localhost:8080/api/user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
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
          setRooms(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    fetchRooms();
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  return (
    <div>
      {user !== null ?
        <h1>Welcome, {user.email}!</h1>
        :
        ""
      }
      {rooms !== null ?
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {rooms.map((room) => (
              <button key={room.id}
                style={{ marginRight: '20px', marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}
                onClick={() => handleRoomClick(room)}>
                <div style={{ fontWeight: 'bold' }}>{room.name}</div>
                {/* Other room information goes here */}
              </button>
            ))}
          </div>
          {selectedRoom && <RoomModal room={selectedRoom} />}
        </>
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