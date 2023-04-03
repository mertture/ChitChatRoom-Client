import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import { formatEmail } from "../../utils";
import RoomType from "../../models/room/room";
import User from "../../models/user/user";
import Message from "../../models/chat/message";
import { Button } from "antd";
import "../../styles/chat.css";


const Room: React.FC = () => {

  const navigate = useNavigate();
  const { id: roomId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomType | null>(null);
  const [participants, setParticipants] = useState<Array<User> | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<Message>>([]);
  const [messageText, setMessageText] = useState("");
  const [showChat, setShowChat] = useState(false);

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
          break;
        case "message":
          setChatMessages(data.messages);
          break;
        default:
          break;
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


  const LeaveRoom = () => {
    navigate('/dashboard');
  };

  const sendChatMessage = (message: string) => {

    if (socket && user) {
      const createdAt = Date.now();
      socket.send(JSON.stringify({
        action: "chat",
        room: roomId,
        participant: user.id,
        data: {
          email: user.email,
          content: message,
          createdAt,
        }
      }));
      // const createdMessage: Message = formatMessage(user.id, user.email, message, createdAt)
      // setChatMessages([...chatMessages, createdMessage]);
    }
  };

  return (
    <div>
       {room ? (
        <div className="room-header">
          <h1>Welcome to Room {room.name}!</h1>
          <Button onClick={LeaveRoom}>Leave Room</Button>
        </div>
      ) : (
        <div className="room-header">
          <h1>Loading Room...</h1>
        </div>
      )}
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
      <div className="chat-tab">
        <button onClick={() => setShowChat(!showChat)}>Toggle Chat</button>
      </div>
      <div className={`chat-container ${showChat ? 'show' : 'hide'}`}>
        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Chat:</div>
        <div style={{ maxHeight: "200px", overflowY: "scroll", marginBottom: "10px" }}>
          {chatMessages ? chatMessages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.sender.id === user?.id ? 'sent' : 'received'}`}
            >
              <div>{message.content}</div>
              <div className="meta">
                <span>{formatEmail(message.sender.email)}</span>
                <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          )) : ""}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); sendChatMessage(messageText); setMessageText(''); }}>
          <input type="text" placeholder="Type a message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Room;

