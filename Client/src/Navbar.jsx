import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import NavbarComponent from "./Component/NavbarComponent";
import { useGlobalContext } from "./Context/useGlobalContext";
import loginIcon from "/login.png";
import signoutIcon from "/signout.png";

export default function Navbar() {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const { navbar, setNavbar } = useGlobalContext();

  const username = localStorage.getItem("Username");

  const style = {
    marginLeft: username ? "" : "auto",
    marginRight: username ? "" : "auto",
  };

  const removeNavbarItem = async () => {
    return new Promise((resolve, reject) => {
      const defaultNavbar = navbar.map((item) => {
        return { ...item, active: false };
      });

      setNavbar(defaultNavbar);

      resolve(defaultNavbar);
    });
  };

  const handleSignOut = async () => {
    if (!cookies.access_token) return;
    await removeNavbarItem();
    setCookies("access_token", "");
    localStorage.clear();
    navigate("intermediateExpenseTracker/login");
  };

  const handleLogin = () => {
    if (cookies.access_token) return;

    setNavbar((prev) => {
      let updatedNav = prev.map((item) => {
        return { ...item, active: false };
      });

      return updatedNav;
    });

    navigate("intermediateExpenseTracker/login");
  };

  return (
    <div className="navbarContainer">
      <div className="loginNavbarContainer">
        <img
          className="login"
          style={style}
          src={loginIcon}
          alt="loginIcon"
          onClick={handleLogin}
        ></img>
        {cookies.access_token ? (
          <div className="userName">{username}</div>
        ) : null}
      </div>
      {navbar.map((item, index) => {
        return (
          <NavbarComponent
            id={item.id}
            name={item.name}
            icon={item.icon}
            active={item.active}
            setNavbar={setNavbar}
            key={index}
          />
        );
      })}
      {cookies.access_token ? (
        <img
          className="signOut"
          src={signoutIcon}
          alt="signoutIcon"
          onClick={handleSignOut}
        ></img>
      ) : null}
    </div>
  );
}
