import { useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { LuImagePlus } from "react-icons/lu";
import { apiUrl, getToken } from "../utils.js";

export default function MsgInput({ isPending, chatId, action, setRefresh }) {
  const [msgText, setMsgText] = useState(null);
  const fileInputRef = useRef(null);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5000000)
      return alert("The image cannot be larger than 5 MB.");
    const formData = new FormData();
    formData.append("image", file);
    const token = getToken();
    const response = await fetch(`${apiUrl}/user/chats/${chatId}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (response.ok) setRefresh(true);
  }

  return (
    <form className="msgInput" action={action}>
      <input type="hidden" name="chatId" value={chatId} />
      <input
        type="text"
        name="message"
        id="message"
        autoFocus
        disabled={isPending}
        placeholder="Write a message..."
        onChange={(e) => {
          setMsgText(e.target.value);
        }}
        value={msgText}
        required
      />
      <button
        type="button"
        onClick={() => {
          fileInputRef.current.click();
        }}
        className={"imgSend"}
      >
        <LuImagePlus />{" "}
        <input
          type="file"
          name="image"
          onChange={handleImageUpload}
          hidden
          ref={fileInputRef}
        />
      </button>
      <button type="submit" disabled={isPending || !msgText}>
        <IoIosSend />
      </button>
    </form>
  );
}
