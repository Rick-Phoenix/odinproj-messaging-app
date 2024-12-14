import { use, useActionState, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  apiUrl,
  getRequestWithToken,
  getToken,
  postRequestWithToken,
  UserContext,
} from "../utils.js";
import { IoIosSend } from "react-icons/io";
import MsgInput from "./MsgInput.jsx";

function getDateAndTime(string) {
  const splitStr = string.split("T");
  const date = splitStr[0];
  const time = splitStr[1].split(".")[0];
  return { date, time };
}

export default function GroupChat() {
  const { chatId } = useParams();
  const { userData } = use(UserContext);
  const [chat, setChat] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [state, sendMessage, isPending] = useActionState(
    async (previousState, formData) => {
      await postRequestWithToken(formData, `/user/groupChats/${chatId}`);
      setRefresh(true);
      return null;
    },
    null
  );
  const [error, updatePicUrl, picUrlisPending] = useActionState(
    async (previous, formData) => {
      const token = getToken();
      const response = await fetch(`${apiUrl}/user/groupChats/chatPic`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) return await response.json();
      setIsEditingPic(false);
      setRefresh(true);
      return null;
    },
    null
  );

  console.log(chat);

  useEffect(() => {
    if (refresh) {
      async function fetchData() {
        const response = await getRequestWithToken(
          `/user/groupChats/${chatId}`
        );
        if (response.ok) {
          setRefresh(false);
          setChat(response.data);
        }
      }

      fetchData();
    }
  }, [chatId, refresh]);

  if (!chat || !userData) return <></>;

  if (isEditingPic)
    return (
      <div className="chatPicEdit">
        <img
          src={
            chat.chatPicUrl ||
            "https://res.cloudinary.com/dqjizh49f/image/upload/v1734014258/Messaging%20App/mvnscba5oovyl1je3pdq.jpg"
          }
          alt="Chat Picture"
        />
        <form action={updatePicUrl} method="post" encType="multipart/form-data">
          <input type="hidden" name="chatId" value={chatId} />
          <label htmlFor="chatPic">
            <h3>Upload a new chat picture</h3>
          </label>
          <input
            type="file"
            name="chatPic"
            accept=".png,.jpg,.jpeg,.webp"
            disabled={picUrlisPending}
            required
          />
          <button type="submit" disabled={picUrlisPending}>
            Upload
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditingPic(false);
            }}
          >
            Back to chat
          </button>
          <h3>{error}</h3>
        </form>
      </div>
    );

  return (
    <div className="chatContainer">
      <Link
        onClick={() => {
          setIsEditingPic(true);
        }}
        className="chatHeader nolink"
      >
        <img
          src={
            chat.chatPicUrl ||
            "https://res.cloudinary.com/dqjizh49f/image/upload/v1734014258/Messaging%20App/mvnscba5oovyl1je3pdq.jpg"
          }
          alt="Chat Picture"
        />
        <h3>{chat.name}</h3>
      </Link>
      <div className="chatLayout">
        {chat?.messages && (
          <ul className="messages">
            {chat.messages.map((msg) => {
              const { date } = getDateAndTime(msg.sentAt);
              const today = new Date().toISOString().split("T")[0];
              const isBeforeToday = new Date(date) < new Date(today);
              const isFromUser = msg.user.username === userData.username;
              return (
                <li
                  className={
                    "message" + " " + (!isFromUser ? "fromOthers" : "fromUser")
                  }
                  key={msg.id}
                >
                  <img
                    src={isFromUser ? userData.pfpurl : msg.user.pfpurl}
                    className={"msgPfp"}
                  />
                  <div className="msgGroup">
                    <span className="msgText">
                      {msg.picUrl ? (
                        <img src={msg.picUrl} className="msgPic" />
                      ) : (
                        msg.text
                      )}
                    </span>

                    <span className="msgTime">
                      {isBeforeToday
                        ? `${format(new Date(msg.sentAt), "MMM do 'at' H:mm")}`
                        : `${format(new Date(msg.sentAt), "H:mm")}`}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <MsgInput
          isPending={isPending}
          chatId={chat.id}
          action={sendMessage}
          setRefresh={setRefresh}
        />
      </div>
    </div>
  );
}
