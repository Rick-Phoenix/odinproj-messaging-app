import { use, useActionState, useEffect, useState } from "react";
import {
  postRequestWithToken,
  putRequestWithToken,
  UserContext,
} from "../utils.js";

export default function UserProfile() {
  const { userData, setRefresh } = use(UserContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userData && userData.profile) {
      setProfile({ ...userData.profile });
    }
  }, [userData]);

  const [formState, sendForm, isPending] = useActionState(
    async (previousState, formData) => {
      let response;
      if (!profile)
        response = await postRequestWithToken(formData, "/user/profile");
      if (profile)
        response = await putRequestWithToken(formData, "/user/profile");
      setIsEditing(false);
      setRefresh(true);
      return response.msg;
    },
    null
  );

  if (!userData) return <></>;

  if (!profile || isEditing)
    return (
      <div>
        {!profile && <h3>Create a profile</h3>}
        <form action={sendForm}>
          <fieldset disabled={isPending}>
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={profile?.name}
              required
            />
            <label htmlFor="status">Status: </label>
            <input
              type="text"
              name="status"
              id="status"
              required
              defaultValue={profile?.status || "Hello there!"}
            />
            <label htmlFor="bio">Bio: </label>
            <textarea
              name="bio"
              id="bio"
              placeholder="Tell the world about yourself..."
              defaultValue={profile?.bio}
            ></textarea>
            <button type="submit">Save</button>
          </fieldset>
        </form>
      </div>
    );
  return (
    <>
      Name: {profile.name}, Status: {profile.status}, Bio: {profile.bio}
      <button
        type="button"
        onClick={() => {
          setIsEditing(true);
        }}
      >
        Edit
      </button>
    </>
  );
}
