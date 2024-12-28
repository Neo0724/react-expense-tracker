import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../Context/useGlobalContext";

export default function Login() {
  const { BASE_URL } = useGlobalContext();

  const [data, setData] = useState({ username: "", password: "" });

  const [isLoading, setIsLoading] = useState(false);

  const [_, setCookie] = useCookies(["access_token"]);

  const { setNavbar, navbar, setLoginErr } = useGlobalContext();

  const navigate = useNavigate();

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

  const handleNavbar = async () => {
    return new Promise((resolve, reject) => {
      let updatedNavbar = navbar.map((item) => {
        if (item.id === 1) return { ...item, active: true };
        return item;
      });

      setNavbar(updatedNavbar);
      resolve(updatedNavbar);
    });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        username: data.username,
        password: data.password,
      });
      setCookie("access_token", res.data.token);
      localStorage.setItem("User ID", res.data.userID);
      localStorage.setItem("Username", res.data.userName);
      await handleNavbar();
      navigate("/intermediateExpenseTracker/dashboard");
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
      <button className="submitBtn" type="submit" disabled={isLoading.current}>
        {isLoading ? "loading..." : "login"}
      </button>
      <span>
        Do not have an account?{" "}
        <Link to="/intermediateExpenseTracker/register">Register now</Link>
      </span>
    </form>
  );
}
