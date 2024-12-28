import axios from "axios";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../Context/useGlobalContext";

export default function Register() {
  const { BASE_URL } = useGlobalContext();

  const [data, setData] = useState({ username: "", password: "" });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setData((prev) => {
      return { ...prev, username: e.target.value };
    });
  };

  const handlePasswordChange = (e) => {
    setData((prev) => {
      return { ...prev, password: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        username: data.username,
        password: data.password,
      });
      navigate("/intermediateExpenseTracker/login");
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form action="POST" className="authContainer" onSubmit={handleSubmit}>
      <input
        type="text"
        className="usernameInput"
        placeholder="Enter your username..."
        value={data.username}
        onChange={handleUsernameChange}
        required={true}
      />
      <div className="horizontalLine"></div>
      <input
        type="password"
        className="usernameInput"
        placeholder="Enter your password ..."
        value={data.password}
        onChange={handlePasswordChange}
        required={true}
      />
      <div className="horizontalLine"></div>
      <button className="submitBtn" type="submit" disabled={isLoading}>
        {isLoading ? "loading..." : "register"}
      </button>
      <span>
        Already have an account?{" "}
        <Link to="/expenseTracker/login">Log in now</Link>
      </span>
    </form>
  );
}
