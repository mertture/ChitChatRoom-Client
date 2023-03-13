import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
  email: string;
  password: string;
  role: number;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    role: 1,
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/register", user);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="email"
        value={user.email}
        onChange={handleInputChange}
      />
      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleInputChange}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;