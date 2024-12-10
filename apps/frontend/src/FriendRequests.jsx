import { use, useActionState } from "react";
import { postRequestWithToken, useFetchUser, UserContext } from "../utils.js";
import { BsCheck } from "react-icons/bs";
import { BsX } from "react-icons/bs";

export default function FriendRequests() {
  const { userData, setRefresh } = use(UserContext);
  const requests = userData.incomingFriendRequests;
  const [state, acceptRequest, isPending] = useActionState(
    async (previousState, formData) => {
      const response = await postRequestWithToken(
        formData,
        "/user/friendRequest/accept"
      );
      setRefresh(true);
      return true;
    },
    null
  );

  return (
    <>
      <h3>Friend Requests: </h3>
      <ul>
        {requests.map((request, i) => {
          if (request.status === "Pending")
            return (
              <li key={i}>
                {request.user1.email}
                {request.user1.username}
                <form action="">
                  <input
                    type="hidden"
                    name="email"
                    value={request.user1.email}
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    formAction={acceptRequest}
                  >
                    <BsCheck />
                  </button>

                  <button type="submit">
                    <BsX />
                  </button>
                </form>
              </li>
            );
        })}
      </ul>
    </>
  );
}
