import { Link } from "react-router-dom";
import "./App.css";
import { getToken, useFetchUser, UserContext } from "../utils.js";

import Dashboard from "./Dashboard.jsx";

function App() {
  const token = getToken();
  const { userData, setRefresh } = useFetchUser();
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

      {userData && (
        <UserContext value={{ userData, setRefresh }}>
          <Dashboard />
        </UserContext>
      )}
    </>
  );
}

export default App;
