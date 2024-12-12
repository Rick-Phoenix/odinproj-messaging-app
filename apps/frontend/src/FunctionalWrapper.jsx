import { Link, Outlet, useNavigate } from "react-router-dom";
import Odin from "./assets/Images/odin banner.png";
import { use, useEffect, useState } from "react";
import { UserContext } from "../utils.js";
import Sidebar from "./Sidebar.jsx";
import { IoLogOut } from "react-icons/io5";
import { TiThMenuOutline } from "react-icons/ti";
import { LuMessageSquarePlus } from "react-icons/lu";
import { FaUserFriends } from "react-icons/fa";
import FriendsList from "./FriendsList.jsx";

export default function FunctionalWrapper() {
  const { userData, setRefresh } = use(UserContext);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("JWT");
    navigate(0);
  }

  useEffect(() => {
    if (toggleSidebar) {
      function checkClickLocation(e) {
        const clickInsideSidebar = e.composedPath().some((el) => {
          return el.className === "sidebar active";
        });

        if (!clickInsideSidebar) {
          setToggleSidebar(false);
          document.removeEventListener("click", checkClickLocation);
        }
      }

      setTimeout(() => {
        document.addEventListener("click", checkClickLocation);
      }, 500);
    }
  }, [toggleSidebar]);

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
      <Sidebar toggled={toggleSidebar}>
        {userData && (
          <>
            <div className="sidebarTop">
              <h1>
                Hello, <br /> {userData.username}!
              </h1>
              <button
                type="button"
                className="groupChat icon"
                onClick={() => {
                  navigate("/chats/newGroupChat");
                  setToggleSidebar(false);
                }}
              >
                <LuMessageSquarePlus /> New Group Chat
              </button>
              <button
                type="button"
                className="friends icon"
                onClick={() => {
                  navigate("/friends");
                  setToggleSidebar(false);
                }}
              >
                <FaUserFriends /> Friend Requests
              </button>
              <FriendsList />
            </div>
            <div className="sidebarBottom">
              <Link
                to={"/profile/myProfile"}
                onClick={() => {
                  setToggleSidebar(false);
                }}
              >
                <img src={userData.pfpurl} className="sidebarPfp" alt="" />
              </Link>
              <button type="button" className="logout" onClick={handleLogout}>
                <IoLogOut />
              </button>
            </div>
          </>
        )}
      </Sidebar>
      <button
        type="button"
        className="menuToggle"
        onClick={() => {
          setToggleSidebar(!toggleSidebar);
        }}
      >
        <TiThMenuOutline /> Menu
      </button>
      <Outlet />
      <footer>
        <a href="https://www.theodinproject.com/">
          <img src={Odin} alt="Odin Project Logo" />
        </a>
      </footer>
    </>
  );
}