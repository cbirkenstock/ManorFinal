import { Chat, ChatUser, Message, User } from "../../../src/models";
import EventBox from "./SubComponents/EventBox";
import AttendeesView from "./SubComponents/AttendeesView";
import SpotsLeftView from "./SubComponents/SpotsLeftView";
import React, { useEffect, useState } from "react";
import { DataStore } from "aws-amplify";

interface EventMessageProps {
  message: Message;
}
export default function EventMessage(props: EventMessageProps) {
  const { message } = props;
  const [eventChat, setEventChat] = useState<Chat>();

  /* -------------------------------------------------------------------------- */
  /*                              Fetch Event Chat                              */
  /* -------------------------------------------------------------------------- */

  /*
  useEffect for event chat is okay at this higher level becuase all sub components
  rely on it as well meaning there is no unecessary extra rerendering as a result
  */
  useEffect(() => {
    const fetchEventChat = async () => {
      const eventChat = (
        await DataStore.query(Chat, (chat) =>
          chat.id("eq", message.eventChatID!)
        )
      )[0];

      setEventChat(eventChat);
    };

    fetchEventChat();
  }, [message]);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  /*
  Event box is only rendered when event chat is certainly rendered because it's height
  is hard coded so it will render before it's ready out of sync with other components
  */
  return (
    <>
      {eventChat?.membersCount > 3 && <AttendeesView eventChat={eventChat} />}
      {eventChat && <EventBox eventChat={eventChat} />}
      {eventChat?.limit && (
        <SpotsLeftView
          message={message}
          limit={eventChat?.limit}
          membersCount={eventChat.membersCount}
        />
      )}
    </>
  );
}
