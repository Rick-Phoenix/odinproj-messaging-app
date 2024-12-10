import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

export const apiUrl = import.meta.env.VITE_API_URL;

export function getToken() {
  const token = localStorage.getItem("JWT");
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (exp < now) {
      localStorage.removeItem("JWT");
      return false;
    }
    return token;
  } catch {
    localStorage.removeItem("JWT");
    return false;
  }
}

export async function postRequestWithToken(formData, apiRoute) {
  const formObj = Object.fromEntries(formData);
  const token = localStorage.getItem("JWT");
  const response = await fetch(`${apiUrl}${apiRoute}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formObj),
  });

  const resData = await response.json();

  return { ok: response.ok, msg: resData };
}

export const UserContext = createContext(null);

export function useFetchUser() {
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

  return { userData, setRefresh };
}
