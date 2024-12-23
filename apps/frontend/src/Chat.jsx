import { use, useActionState, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  getRequestWithToken,
  postRequestWithToken,
  UserContext,
} from "../utils.js";
import MsgInput from "./MsgInput.jsx";

function getDateAndTime(string) {
  const splitStr = string.split("T");
  const date = splitStr[0];
  return date;
}

export default function Chat() {
  const { contactUsername } = useParams();
  const { userData } = use(UserContext);
  const [chat, setChat] = useState(null);
  const [contact, setContact] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [state, sendMessage, isPending] = useActionState(
    async (previousState, formData) => {
      await postRequestWithToken(formData, `/user/chats/${contactUsername}`);
      setRefresh(true);
      return true;
    },
    null
  );

  useEffect(() => {
    if (contact !== contactUsername) {
      setRefresh(true);
    }
    if (refresh) {
      async function fetchData() {
        const response = await getRequestWithToken(
          `/user/chats/${contactUsername}`
        );
        if (response.ok) {
          setContact(contactUsername);
          setRefresh(false);
          setChat(response.data);
        }
      }

      fetchData();
    }
  }, [contactUsername, refresh, contact]);

  if (!chat || !userData || contactUsername !== contact) return <></>;

  const contactPfp = chat.participants.find(
    (user) => user.username === contactUsername
  ).pfpurl;

  return (
    <>
      {chat && userData && (
        <div className="chatContainer">
          <Link
            to={`/profile/${contactUsername}`}
            className="chatHeader nolink"
          >
            <img src={contactPfp} alt="Contact Picture" />
            <h3>{contactUsername}</h3>
          </Link>
          <div className="chatLayout">
            {chat?.messages.length > 0 && (
              <ul className="messages">
                {chat.messages.map((msg) => {
                  const date = getDateAndTime(msg.sentAt);
                  const today = new Date().toISOString().split("T")[0];
                  const isBeforeToday = new Date(date) < new Date(today);
                  const isFromUser = msg.user.username === userData.username;
                  return (
                    <li
                      className={
                        "message" +
                        " " +
                        (!isFromUser ? "fromOthers" : "fromUser")
                      }
                      key={msg.id}
                    >
                      <img
                        src={isFromUser ? userData.pfpurl : contactPfp}
                        className={"msgPfp"}
                      />
                      <div className="msgGroup">
                        <span className="msgText">
                          {msg.picUrl ? (
                            <img src={msg.picUrl} className="msgPic" />
                          ) : (
                            msg.text
                          )}
                        </span>{" "}
                        <span className="msgTime">
                          {isBeforeToday
                            ? `${format(
                                new Date(msg.sentAt),
                                "MMM do 'at' H:mm"
                              )}`
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
      )}
    </>
  );
}
