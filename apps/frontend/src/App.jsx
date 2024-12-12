import { Link } from "react-router-dom";
import "./App.css";
import { getToken, UserContext } from "../utils.js";
import { use } from "react";
import ChatsList from "./ChatsList.jsx";

function App() {
  const token = getToken();
  const { userData } = use(UserContext);

  console.log(userData);

  return (
    <>
      {!token && (
        <div>
          <h1>Messaging App</h1>
          <Link to={"/login"}>
            <button type="button">Log In</button>
          </Link>
          <Link to={"/signup"}>
            <button type="button">Sign Up</button>
          </Link>
        </div>
      )}

      {userData && <ChatsList />}
    </>
  );
}

export default App;
