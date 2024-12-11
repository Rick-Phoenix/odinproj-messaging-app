import { Link, Outlet } from "react-router-dom";

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
    </>
  );
}
