import { Link, Outlet, useNavigate } from "react-router-dom";
import Odin from "./assets/Images/odin banner.png";
import { use } from "react";
import { UserContext } from "../utils.js";

export default function LogoHeader() {
  const { setRefresh } = use(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <header>
        <Link
          onClick={() => {
            setRefresh(true);
            navigate("/");
          }}
        >
          <img
            src="https://res.cloudinary.com/dqjizh49f/image/upload/v1733909857/Messaging%20App/poplogo.webp"
            alt="app logo"
          />
        </Link>
      </header>
      <Outlet />
      <footer>
        <a href="https://www.theodinproject.com/">
          <img src={Odin} alt="Odin Project Logo" />
        </a>
      </footer>
    </>
  );
}
