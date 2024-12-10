import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequestWithToken, UserContext } from "../utils.js";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const { userData } = use(UserContext);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (username === userData?.username)
      return navigate("/profile/myProfile", { replace: true });
    async function fetchData() {
      const response = await getRequestWithToken(`/user/profiles/${username}`);
      if (!response.ok) return setError(response.data);
      if (response.ok) setProfile(response.data);
    }

    fetchData();
  }, [username, userData, navigate]);

  if (error) return <h2>{error}</h2>;

  if (!profile) return <></>;

  return (
    <>
      <h1>{username}</h1>
      Status: {profile.status}, {profile.bio && <span>Bio: {profile.bio}</span>}
    </>
  );
}
