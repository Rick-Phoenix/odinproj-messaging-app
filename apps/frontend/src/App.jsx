import { useNavigate } from "react-router-dom";
import "./App.css";
import { getToken, UserContext } from "../utils.js";
import { use } from "react";
import ChatsList from "./ChatsList.jsx";
import { IoIosLogIn } from "react-icons/io";
import { BsPersonFillUp } from "react-icons/bs";

function App() {
  const token = getToken();
  const { userData } = use(UserContext);
  const navigate = useNavigate();

  console.log(userData);

  return (
    <>
      {!token && (
        <div className="home">
          <h1>Welcome to Pop!</h1>
          <button
            type="button"
            className="icon"
            onClick={() => {
              navigate("/login");
            }}
          >
            <IoIosLogIn /> Log In
          </button>
          <button
            type="button"
            className="icon"
            onClick={() => {
              navigate("/signup");
            }}
          >
            <BsPersonFillUp /> Sign Up
          </button>
        </div>
      )}

      {userData && <ChatsList />}
    </>
  );
}

export default App;
