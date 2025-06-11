/* eslint-disable react/prop-types */
import { useNavigate } from "react-router";

export default function NavbarComponent({
  id,
  name,
  route,
  icon,
  active,
  setNavbar,
}) {
  const navigate = useNavigate();

  const style = {
    display: active ? "" : "none",
  };

  const opacity = {
    opacity: active ? 1 : 0.7,
  };

  const handleNavigate = () => {
    setNavbar((prev) => {
      let newItem = prev.map((item) =>
        item.id === id ? { ...item, active: true } : { ...item, active: false }
      );
      return newItem;
    });

    navigate(`/${route}`);
  };

  return (
    <div
      className="navbarComponentContainer"
      onClick={handleNavigate}
      style={opacity}
    >
      <div className="verticalLine" style={style}></div>
      <div className="navbarComponentTitleAndIcon">
        <img src={icon} alt={name} className="navbarComponentIcons" />
        <div className="dashboardTitle">{name}</div>
      </div>
    </div>
  );
}
