import { use, useActionState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl, getToken, UserContext } from "../utils.js";

export default function LoginPage() {
  const { setRefresh } = use(UserContext);
  const navigate = useNavigate();
  const [error, loginAction, isPending] = useActionState(async function (
    previousState,
    formData
  ) {
    const formObj = Object.fromEntries(formData);
    if (formObj.password !== formObj.passconfirm)
      return "The passwords do not match.";
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObj),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return responseData;
    }

    localStorage.setItem("JWT", responseData.token);
    setRefresh(true);
    navigate("/", { replace: true });
    return null;
  },
  null);

  useEffect(() => {
    if (getToken()) {
      return navigate("/");
    }
  }, [navigate]);

  return (
    <div className="formPage">
      <h2>Log In</h2>
      <form action={loginAction}>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" id="username" required />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" id="password" required />
        <label htmlFor="passconfirm">Confirm Password: </label>
        <input type="password" name="passconfirm" id="passconfirm" required />
        <button type="submit" disabled={isPending}>
          Log In
        </button>
      </form>
      {error && (
        <div className="error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
