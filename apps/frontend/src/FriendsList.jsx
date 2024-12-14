import { use } from "react";
import { UserContext } from "../utils.js";
import { Link } from "react-router-dom";

export default function FriendsList() {
  const { friends } = use(UserContext);
  return (
    <>
      {friends.length === 0 && <h3>Friend list is empty.</h3>}
      {friends.length > 0 && (
        <ul className="friendsList">
          {friends.map((friend, i, arr) => {
            return (
              <li key={friend.username}>
                {i === 0 ? (
                  <>
                    <h3>Friends</h3>
                  </>
                ) : null}
                <Link className="friendItem" to={`/chats/${friend.username}`}>
                  <img
                    src={friend.pfpurl}
                    alt={friend.username}
                    className="friendPfp"
                  />
                  <span className="friendUsername">{friend.username}</span>
                </Link>
                {i !== arr.length - 1 && <hr />}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
