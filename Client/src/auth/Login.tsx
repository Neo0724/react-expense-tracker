import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../Context/useGlobalContext";
import { customAxios } from "../utils/custom-axios";
import { useAuthContext } from "../Context/useAuthContext";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const [isLoading, setIsLoading] = useState(false);

  const { setNavbar, navbar, setLoginErr } = useGlobalContext();

  const { setIsAuthenticated } = useAuthContext();

  const navigate = useNavigate();

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

  const resetNavbar = () => {
    let updatedNavbar = navbar.map((item) => {
      if (item.id === 1) return { ...item, active: true };
      return item;
    });

    setNavbar(updatedNavbar);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const res = await customAxios.post(`/auth/login`, {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("Username", res.data.data.username);
      resetNavbar();
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.request.status;
        status === 404
          ? setLoginErr({ text: "User not found", error: true })
          : setLoginErr({ text: "Password is incorrect", error: true });
      } else {
        console.error(err);
      }
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
