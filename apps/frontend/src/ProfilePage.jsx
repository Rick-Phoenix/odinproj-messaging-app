import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequestWithToken, UserContext } from "../utils.js";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [pfpurl, setPfpurl] = useState(null);
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
      if (response.ok) {
        setPfpurl(response.data.pfpurl);
        setProfile(response.data.profile);
      }
    }

    fetchData();
  }, [username, userData, navigate]);

  if (error) return <h2>{error}</h2>;

  if (!profile) return <></>;

  return (
    <div className="profilePanel">
      <h3>{username}</h3>
      <img className="pfp" src={pfpurl} alt="" />
      <div className="profileInfo">
        <div className="infoName">
          <h4 className="panelHeader">Name</h4>
        </div>{" "}
        <div className="infoContent panelText">{profile.name}</div>
        <div className="infoName">
          <h4 className="panelHeader">Status</h4>
        </div>{" "}
        <div className="infoContent panelText">{profile.status}</div>
        <div className="infoName">
          <h4 className="panelHeader">Bio</h4>
        </div>{" "}
        <div className="infoContent panelText">{profile.bio}</div>
      </div>
    </div>
  );
}
