import { useEffect, useState } from "react";
import { apiUrl, getToken, UserContext } from "../utils.js";

export function UserContextProvider({ children }) {
  const [refresh, setRefresh] = useState(true);
  const [userData, setUserData] = useState(null);

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
          setRefresh(false);
          setUserData({ ...responseData });
        }

        getData();
      }
    }
  }, [refresh]);

  return <UserContext value={{ userData, setRefresh }}>{children}</UserContext>;
}
