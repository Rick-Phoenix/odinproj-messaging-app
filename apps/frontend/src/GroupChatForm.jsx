import { use, useActionState } from "react";
import { postRequestWithToken, UserContext } from "../utils.js";
import { useNavigate } from "react-router-dom";

export default function GroupChatForm() {
  const { friends } = use(UserContext);
  const navigate = useNavigate();
  const [error, submitForm, isPending] = useActionState(
    async (previousState, formData) => {
      const participants = formData.getAll("participants");
      const name = formData.get("name");
      if (participants.length < 2)
        return "You must select at least two participants.";
      const obj = { participants, name };
      const response = await postRequestWithToken(
        Object.entries(obj),
        "/user/groupChats"
      );
      if (response.ok) navigate(`/groupChats/${response.msg}`);
      return null;
    },
    null
  );

  return (
    <>
      {friends && (
        <form action={submitForm}>
          <fieldset disabled={isPending}>
            <label htmlFor="name">Chat name:</label>
            <input type="text" name="name" id="name" required />
            {friends.map((friend) => {
              return (
                <div key={friend.username}>
                  <label htmlFor="participants">{friend.username}</label>
                  <input
                    type="checkbox"
                    name="participants"
                    id="participants"
                    value={friend.username}
                  />
                </div>
              );
            })}
            <button type="submit">Create Chat</button>
          </fieldset>
          {error && <h3>{error}</h3>}
        </form>
      )}
    </>
  );
}
