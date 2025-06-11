import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../Context/useGlobalContext";

export default function Login() {
  const { BASE_URL } = useGlobalContext();

  const [formData, setFormData] = useState({ username: "", password: "" });

  const [isLoading, setIsLoading] = useState(false);

  const [_, setCookie] = useCookies(["access_token"]);

  const { setNavbar, navbar, setLoginErr } = useGlobalContext();

  const navigate = useNavigate();

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

  const resetNavbar = () => {
    let updatedNavbar = navbar.map((item) => {
      if (item.id === 1) return { ...item, active: true };
      return item;
    });

    setNavbar(updatedNavbar);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        username: formData.username,
        password: formData.password,
      });
      setCookie("access_token", res.data.token);
      localStorage.setItem("User ID", res.data.userID);
      localStorage.setItem("Username", res.data.userName);
      resetNavbar();
      navigate("/dashboard");
    } catch (err) {
      const status = err.request.status;
      status === 404
        ? setLoginErr({ text: "User not found", error: true })
        : setLoginErr({ text: "Password is incorrect", error: true });
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
        {isLoading ? "loading..." : "login"}
      </button>
      <span>
        Do not have an account?{" "}
        <Link className="underline font-bold" to="/register">
          Register now
        </Link>
      </span>
    </form>
  );
}
