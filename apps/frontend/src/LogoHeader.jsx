import { Link, Outlet } from "react-router-dom";
import Odin from "./assets/Images/odin banner.png";

export default function LogoHeader() {
  return (
    <>
      <header>
        <Link to={"/"}>
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
