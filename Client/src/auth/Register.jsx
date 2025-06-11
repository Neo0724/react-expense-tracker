import axios from "axios";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../Context/useGlobalContext";

export default function Register() {
  const { BASE_URL } = useGlobalContext();

  const [formData, setFormData] = useState({ username: "", password: "" });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setFormData((prev) => {
      return { ...prev, username: e.target.value };
    });
  };

  const handlePasswordChange = (e) => {
    setFormData((prev) => {
      return { ...prev, password: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        username: formData.username,
        password: formData.password,
      });
      navigate("/login");
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
        value={formData.username}
        onChange={handleUsernameChange}
        required={true}
      />
      <div className="horizontalLine"></div>
      <input
        type="password"
        className="usernameInput"
        placeholder="Enter your password ..."
        value={formData.password}
        onChange={handlePasswordChange}
        required={true}
      />
      <div className="horizontalLine"></div>
      <button className="submitBtn" type="submit" disabled={isLoading}>
        {isLoading ? "loading..." : "register"}
      </button>
      <span>
        Already have an account?{" "}
        <Link className="underline font-bold" to="/login">
          Log in now
        </Link>
      </span>
    </form>
  );
}
