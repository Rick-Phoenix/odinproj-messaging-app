import { jwtDecode } from "jwt-decode";
import { createContext } from "react";

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
  const token = getToken();
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

export async function putRequestWithToken(formData, apiRoute) {
  const formObj = Object.fromEntries(formData);
  const token = getToken();
  const response = await fetch(`${apiUrl}${apiRoute}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formObj),
  });

  const resData = await response.json();

  return { ok: response.ok, msg: resData };
}

export async function getRequestWithToken(apiRoute) {
  const token = getToken();
  const response = await fetch(`${apiUrl}${apiRoute}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resData = await response.json();

  return { ok: response.ok, data: resData };
}

export const UserContext = createContext(null);
