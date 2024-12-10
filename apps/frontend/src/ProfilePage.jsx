import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRequestWithToken } from "../utils.js";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    async function fetchData() {
      const response = await getRequestWithToken(`/user/profiles/${username}`);
      if (!response.ok) return setError(response.data);
      if (response.ok) setProfile(response.data);
    }

    fetchData();
  }, [username]);

  if (error) return <h2>{error}</h2>;

  if (!profile) return <></>;

  return (
    <>
      <h1>{username}</h1>
      Status: {profile.status}, {profile.bio && <span>Bio: {profile.bio}</span>}
    </>
  );
}
