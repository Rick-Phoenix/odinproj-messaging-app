import { useEffect, useState } from "react";
import { apiUrl, getToken, UserContext } from "../utils.js";

export function UserContextProvider({ children }) {
  const [refresh, setRefresh] = useState(true);
  const [userData, setUserData] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (refresh) {
      const token = getToken();
      if (token) {
        async function getData() {
          const response = await fetch(`${apiUrl}/user`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const responseData = await response.json();
          setFriends([...responseData.friends, ...responseData.friendOf]);
          setUserData({ ...responseData });
        }

        getData();
      }
    }
    setRefresh(false);
  }, [refresh]);

  return (
    <UserContext value={{ userData, setRefresh, friends }}>
      {children}
    </UserContext>
  );
}