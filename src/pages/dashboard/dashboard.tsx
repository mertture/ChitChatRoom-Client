import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  email: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      { user !== null ?
      <h1>Welcome, {user.email}!</h1>
      :
        ""
      }
    </div>
  );
};

export default Dashboard;