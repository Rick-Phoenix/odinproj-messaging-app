import { useNavigate } from "react-router-dom";
import { getToken, UserContext } from "../utils.js";
import { use } from "react";
import ChatsList from "./ChatsList.jsx";
import { IoIosLogIn } from "react-icons/io";
import { BsPersonFillUp } from "react-icons/bs";
import Carousel from "./Carousel.jsx";

function App() {
  const token = getToken();
  const { userData } = use(UserContext);
  const navigate = useNavigate();

  return (
    <>
      {!token && (
        <div className="home">
          <h1>
            Welcome to <span className="textGradient">Pop!</span>
          </h1>
          <div className="buttons">
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
          <Carousel />
        </div>
      )}

      {userData && <ChatsList />}
    </>
  );
}

export default App;
