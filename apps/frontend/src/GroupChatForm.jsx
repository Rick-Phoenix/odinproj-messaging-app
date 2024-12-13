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
        return "You must select at least two friends.";
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
    <div className="groupChat panel">
      <h3>New Group Chat</h3>
      {friends && (
        <form action={submitForm}>
          <fieldset disabled={isPending}>
            <div className="inputGroup">
              <label htmlFor="name">Chat name:</label>
              <input type="text" name="name" id="name" required />
            </div>
            <h3>Friends</h3>
            <ul className="friendsList">
              {friends.map((friend) => {
                return (
                  <li className="friendItem" key={friend.username}>
                    <label htmlFor={friend.username}>
                      <img
                        className="pfp"
                        src={friend.pfpurl}
                        alt={friend.username}
                      />
                      <span>{friend.username}</span>
                      <input
                        type="checkbox"
                        name="participants"
                        id={friend.username}
                        value={friend.username}
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
            <button type="submit">Create Chat</button>
          </fieldset>
          {error && <h3>{error}</h3>}
        </form>
      )}
    </div>
  );
}
