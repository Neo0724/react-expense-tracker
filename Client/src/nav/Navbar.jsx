import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import NavbarComponent from "./NavbarComponent";
import { useGlobalContext } from "../Context/useGlobalContext";
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

  const resetNavbar = () => {
    const defaultNavbar = navbar.map((item) => {
      return { ...item, active: false };
    });

    setNavbar(defaultNavbar);
  };

  const handleSignOut = async () => {
    resetNavbar();
    setCookies("access_token", "");
    localStorage.clear();
    navigate("/login");
  };

  const handleLogin = () => {
    setNavbar((prev) => {
      let updatedNav = prev.map((item) => {
        return { ...item, active: false };
      });

      return updatedNav;
    });

    navigate("/login");
  };

  return (
    <div className="navbarContainer">
      <div className="loginNavbarContainer">
        <img
          className="login"
          style={style}
          src={loginIcon}
          alt="loginIcon"
          onClick={() => {
            if (cookies.access_token) {
              return;
            }

            handleLogin();
          }}
        ></img>
        {cookies.access_token && <div className="userName">{username}</div>}
      </div>
      {navbar.map((item, index) => {
        return (
          <NavbarComponent
            id={item.id}
            name={item.name}
            icon={item.icon}
            active={item.active}
            route={item.route}
            setNavbar={setNavbar}
            key={index}
          />
        );
      })}
      {cookies.access_token && (
        <button
          className={`mt-auto flex flex-col md:flex-row justify-center items-center gap-3 !border-none !m-0 max-w-17 w-full md:!mt-auto md:!max-w-full md:h-14 md:text-[16px] text-[13px] min-w-fit opacity-70`}
          onClick={handleSignOut}
        >
          <img
            src={signoutIcon}
            alt="signoutIcon"
            className="w-[30px] h-[30px] object-contain"
          />
          Sign Out
        </button>
      )}
    </div>
  );
}
