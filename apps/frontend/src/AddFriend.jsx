import { useActionState, useState } from "react";
import { postRequestWithToken } from "../utils.js";

export default function AddFriend() {
  const [toggleInput, setToggleInput] = useState(false);
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

  if (toggleInput)
    return (
      <form action={addFriendAction}>
        <label htmlFor="email">Add by email: </label>
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
          Add Friend
        </button>
        <h4>{feedbackMsg}</h4>
      </form>
    );

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setToggleInput(true);
        }}
      >
        Add a friend
      </button>
    </>
  );
}
