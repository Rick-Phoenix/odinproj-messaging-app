import { useActionState, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRequestWithToken, postRequestWithToken } from "../utils.js";

function getDateAndTime(string) {
  const splitStr = string.split("T");
  const date = splitStr[0];
  const time = splitStr[1].split(".")[0];
  return { date, time };
}

export default function GroupChat() {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [state, sendMessage, isPending] = useActionState(
    async (previousState, formData) => {
      await postRequestWithToken(formData, `/user/groupChats/${chatId}`);
      setRefresh(true);
      return true;
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

  return (
    <>
      {chat && (
        <>
          <h1>{chat.name}</h1>
          <form action={sendMessage}>
            <input type="hidden" name="chatId" value={chat.id} />
            <input
              type="text"
              name="message"
              id="message"
              autoFocus
              disabled={isPending}
            />
            <button type="submit" disabled={isPending}>
              Send
            </button>
          </form>
          {chat?.messages &&
            chat.messages.map((msg) => {
              const { date, time } = getDateAndTime(msg.sentAt);
              return (
                <div key={msg.id}>
                  {msg.text} Sent by {msg.user.username} on {date} at {time}
                </div>
              );
            })}
        </>
      )}
    </>
  );
}
