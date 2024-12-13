import { useActionState, useEffect } from "react";
import { apiUrl, getToken } from "../utils.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const navigate = useNavigate();
  const [errors, signupAction, isPending] = useActionState(async function (
    previousState,
    formData
  ) {
    const formObj = Object.fromEntries(formData);
    const response = await fetch(`${apiUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObj),
    });

    if (!response.ok) {
      const errors = await response.json();
      return errors;
    }

    setIsSubmitted(true);
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 3000);
    return null;
  },
  null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (getToken()) {
      return navigate("/");
    }
  }, [navigate]);

  return (
    <div className="formPage">
      <h2>Sign Up</h2>
      {isSubmitted && (
        <h3>User signed up successfully. Redirecting to the login page.</h3>
      )}
      {!isSubmitted && (
        <form action={signupAction}>
          <label htmlFor="username">Username: </label>
          <input type="text" name="username" id="username" required />
          <label htmlFor="password">Password: </label>
          <input type="password" name="password" id="password" required />
          <label htmlFor="passconfirm">Confirm Password: </label>
          <input type="password" name="passconfirm" id="passconfirm" required />
          <label htmlFor="email">Email: </label>
          <input type="email" name="email" id="email" />
          <button type="submit" disabled={isPending}>
            Sign Up
          </button>
          {errors && (
            <div>
              <h3>Errors</h3>
              <ul>
                {errors.map((error, i) => {
                  return (
                    <li className="disc" key={i}>
                      {error.msg}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default SignUpPage;
