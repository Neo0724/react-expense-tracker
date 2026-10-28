import { useNavigate } from "react-router";
import { useState } from "react";
import { Link } from "react-router-dom";
import { customAxios } from "../utils/custom-axios";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => {
      return { ...prev, username: e.target.value };
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => {
      return { ...prev, password: e.target.value };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      await customAxios.post(`/auth/register`, {
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
