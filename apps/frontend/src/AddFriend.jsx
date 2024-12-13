import { useActionState, useState } from "react";
import { postRequestWithToken } from "../utils.js";
import { IoPersonAdd } from "react-icons/io5";

export default function AddFriend() {
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [state, addFriendAction, isPending] = useActionState(async function (
    previousState,
    formData
  ) {
    const response = await postRequestWithToken(
      formData,
      "/user/friendRequest/new"
    );
    setFeedbackMsg(response.msg);
    return response;
  },
  null);

  return (
    <form className="addFriend" action={addFriendAction}>
      <label htmlFor="email">Friend Email: </label>
      <div className="inputGroup">
        <input
          type="email"
          name="email"
          id="email"
          required
          disabled={isPending}
          onChange={() => {
            if (feedbackMsg) setFeedbackMsg(null);
          }}
        />
        <button type="submit" disabled={isPending}>
          <IoPersonAdd />
        </button>
      </div>
      <h4>{feedbackMsg}</h4>
    </form>
  );
}
