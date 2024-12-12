import { use, useActionState, useEffect, useState } from "react";
import {
  apiUrl,
  getToken,
  postRequestWithToken,
  putRequestWithToken,
  UserContext,
} from "../utils.js";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { userData, setRefresh } = use(UserContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.profile) {
      setProfile({ ...userData.profile });
    }
  }, [userData]);

  const [responseMsg, sendForm, isPending] = useActionState(
    async (previousState, formData) => {
      const method = !profile ? "POST" : "PUT";
      const token = getToken();
      const response = await fetch(`${apiUrl}/user/profile`, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setIsEditing(false);

      if (!response.ok) {
        const responseMsg = await response.json();
        return responseMsg;
      }
      navigate(0);

      return null;
    },
    null
  );

  if (!userData) return <></>;

  return (
    <>
      <h3>
        {!profile
          ? "Create a profile"
          : isEditing
          ? "Edit profile"
          : userData.username}
      </h3>
      <img className="pfp" src={userData.pfpurl} alt="" />
      <h3>{responseMsg}</h3>
      {!isEditing && profile && (
        <div>
          Name: {profile.name}, Status: {profile.status}, Bio: {profile.bio}
        </div>
      )}
      {(isEditing || !profile) && (
        <form action={sendForm} method="post" encType="multipart/form-data">
          <label htmlFor="pfp">Upload a new profile picture</label>
          <input type="hidden" name="username" value={userData.username} />
          <input type="file" name="pfp" accept=".png,.jpg,.jpeg,.webp" />
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={profile ? profile.name : null}
            required
          />
          <label htmlFor="status">Status: </label>
          <input
            type="text"
            name="status"
            id="status"
            required
            defaultValue={profile ? profile.status : null}
          />
          <label htmlFor="bio">Bio: </label>
          <textarea
            name="bio"
            id="bio"
            placeholder="Tell the world about yourself..."
            defaultValue={profile ? profile.bio : null}
          ></textarea>
          <button type="submit">Save</button>
        </form>
      )}
      {!isEditing && profile && (
        <button
          type="button"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Edit
        </button>
      )}
    </>
  );
}
