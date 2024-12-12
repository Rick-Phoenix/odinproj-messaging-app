import AddFriend from "./AddFriend.jsx";
import FriendRequests from "./FriendRequests.jsx";

export default function FriendsPage() {
  return (
    <div className="friendsContainer">
      <FriendRequests />
      <AddFriend />
    </div>
  );
}
