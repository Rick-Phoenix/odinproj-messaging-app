import { Link } from "react-router-dom";
import "./App.css";
import { apiUrl, getToken, UserContext } from "../utils.js";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard.jsx";

function App() {
  const token = getToken();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (token) {
      async function getData() {
        const response = await fetch(`${apiUrl}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.json();
        setUserData({ ...responseData });
      }

      getData();
    }
  }, [token]);

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
        <UserContext value={userData}>
          <Dashboard />
        </UserContext>
      )}
    </>
  );
}

export default App;
