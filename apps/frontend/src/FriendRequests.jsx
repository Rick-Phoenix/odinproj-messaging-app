import { use } from "react";
import { UserContext } from "../utils.js";
import FriendRequestAction from "./FriendRequestAction.jsx";

export default function FriendRequests() {
  const { userData } = use(UserContext);
  const requests = userData.incomingFriendRequests;

  return (
    <>
      {requests.length === 0 && (
        <h3>There are no pending friend requests at the moment.</h3>
      )}
      {requests.length > 0 && (
        <>
          <h3>Pending Requests: </h3>
          <ul>
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
    </>
  );
}
