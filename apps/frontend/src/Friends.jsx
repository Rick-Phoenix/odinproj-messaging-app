import { use } from "react";
import { UserContext } from "../utils.js";
import { Link, useNavigate } from "react-router-dom";

export default function Friends() {
  const { userData } = use(UserContext);
  const navigate = useNavigate();
  const friends = [...userData.friends, ...userData.friendOf];
  return (
    <>
      {friends.length === 0 && <h3>Friend list is empty.</h3>}
      {friends.length > 0 && (
        <div>
          <h3>Friends List</h3>
          <ul>
            {friends.map((friend) => {
              return (
                <li key={friend.username}>
                  <Link to={`/profile/${friend.username}`}>
                    {friend.username}{" "}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/chats/${friend.username}`);
                    }}
                  >
                    Open Chat
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}