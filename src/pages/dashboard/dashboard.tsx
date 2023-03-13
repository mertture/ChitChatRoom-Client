import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  email: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User>({ email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
    </div>
  );
};

export default Dashboard;