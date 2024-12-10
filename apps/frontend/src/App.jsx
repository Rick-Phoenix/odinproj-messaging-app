import { Link } from "react-router-dom";
import "./App.css";
import { getToken, UserContext } from "../utils.js";

import Dashboard from "./Dashboard.jsx";
import { use } from "react";

function App() {
  const token = getToken();
  const { userData, setRefresh } = use(UserContext);
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

      {userData && <Dashboard />}
    </>
  );
}

export default App;
