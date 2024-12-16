import { use, useActionState, useEffect, useState } from "react";
import { apiUrl, getToken, UserContext } from "../utils.js";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { userData } = use(UserContext);
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
    <div className="profilePanel">
      <h3>
        {!profile
          ? "Create A Profile"
          : isEditing
          ? "Edit Profile"
          : userData.username}
      </h3>
      <img className="pfp" src={userData.pfpurl} alt="" />
      {!isEditing && profile && (
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
      )}
      {(isEditing || !profile) && (
        <fieldset disabled={isPending}>
          <form
            action={sendForm}
            method="post"
            encType="multipart/form-data"
            className="profileInfo"
          >
            <div className="fileInput">
              <label htmlFor="pfp">Upload a new profile picture</label>
              <input type="hidden" name="username" value={userData.username} />
              <input type="file" name="pfp" accept=".png,.jpg,.jpeg,.webp" />
            </div>
            <div className="inputGroup">
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={profile ? profile.name : null}
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="status">Status: </label>
              <input
                type="text"
                name="status"
                id="status"
                required
                defaultValue={profile ? profile.status : null}
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="bio">Bio: </label>
              <textarea
                name="bio"
                id="bio"
                placeholder="Tell the world about yourself..."
                defaultValue={profile ? profile.bio : null}
              ></textarea>
            </div>
            <div className="btnGroup">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>

            {responseMsg && <h3>{responseMsg}</h3>}
          </form>
        </fieldset>
      )}
      {!isEditing && profile && (
        <button
          type="button"
          className="edit"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Edit
        </button>
      )}
    </div>
  );
}
