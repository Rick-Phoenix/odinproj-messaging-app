import { use } from "react";
import { UserContext } from "../utils.js";
import FriendRequestAction from "./FriendRequestAction.jsx";
import AddFriend from "./AddFriend.jsx";

export default function FriendRequests() {
  const { userData } = use(UserContext);

  if (!userData) return <></>;

  const requests = userData.incomingFriendRequests;

  return (
    <div className="friendRequests panel">
      <h3 className="panelHeader">Add A Friend</h3>
      <AddFriend />
      <h3 className="panelHeader">Pending Requests: </h3>
      {requests.length === 0 && (
        <span className="feedbackMsg">
          There are no incoming friend requests at the moment.
        </span>
      )}
      {requests.length > 0 && (
        <>
          <ul className="requests">
            {requests.map((request) => {
              if (request.status === "Pending")
                return (
                  <FriendRequestAction
                    key={request.user1.id}
                    request={request}
                  />
                );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
