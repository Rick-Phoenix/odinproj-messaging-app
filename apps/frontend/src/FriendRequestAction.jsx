import { BsCheck } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import {
  postRequestWithToken,
  putRequestWithToken,
  UserContext,
} from "../utils.js";
import { use, useState } from "react";

export default function FriendRequestAction({ request }) {
  const { setRefresh } = use(UserContext);
  const [isPending, setIsPending] = useState(false);

  async function acceptRequest(formData) {
    setIsPending(true);
    const response = await postRequestWithToken(
      formData,
      "/user/friendRequest/accept"
    );
    if (response.ok) setRefresh(true);
  }

  async function rejectRequest(formData) {
    setIsPending(true);
    const response = await putRequestWithToken(
      formData,
      "/user/friendRequest/reject"
    );

    if (response.ok) setRefresh(true);
  }

  return (
    <>
      <li>
        {request.user1.email}
        {request.user1.username}
        <form action="">
          <input type="hidden" name="friendId" value={request.user1.id} />
          <button type="submit" disabled={isPending} formAction={acceptRequest}>
            <BsCheck />
          </button>

          <button type="submit" disabled={isPending} formAction={rejectRequest}>
            <BsX />
          </button>
        </form>
      </li>
    </>
  );
}
