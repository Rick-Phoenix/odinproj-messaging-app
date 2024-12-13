import { useEffect, useState } from "react";
import { apiUrl, getToken, UserContext } from "../utils.js";

export function UserContextProvider({ children }) {
  const [refresh, setRefresh] = useState(true);
  const [userData, setUserData] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (refresh) {
      const token = getToken();
      if (!token) {
        setUserData(null);
        setFriends([]);
      }
      if (token) {
        async function getData() {
          const response = await fetch(`${apiUrl}/user`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const responseData = await response.json();
          responseData.chats.sort((chatA, chatB) => {
            return (
              new Date(chatB.messages[0].sentAt).getTime() -
              new Date(chatA.messages[0].sentAt).getTime()
            );
          });
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
