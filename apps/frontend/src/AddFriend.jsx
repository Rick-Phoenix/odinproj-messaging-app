import { useActionState, useState } from "react";
import { postRequestWithToken } from "../utils.js";
import { IoPersonAdd } from "react-icons/io5";

export default function AddFriend() {
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [inputText, setInputText] = useState(null);
  const [state, addFriendAction, isPending] = useActionState(async function (
    previousState,
    formData
  ) {
    const response = await postRequestWithToken(
      formData,
      "/user/friendRequest/new"
    );
    setFeedbackMsg(response.msg);
    setInputText(null);
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
          value={inputText}
          onChange={(e) => {
            if (feedbackMsg) setFeedbackMsg(null);
            setInputText(e.target.value);
          }}
        />
        <button
          type="submit"
          className="round"
          disabled={isPending || !inputText}
        >
          <IoPersonAdd />
        </button>
      </div>
      {feedbackMsg && <h4>{feedbackMsg}</h4>}
    </form>
  );
}
