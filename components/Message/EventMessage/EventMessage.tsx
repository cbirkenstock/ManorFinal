import { ChatUser, Message } from "../../../src/models";
import EventBox from "./SubComponents/EventBox";
import AttendeesView from "./SubComponents/AttendeesView";
import SpotsLeftView from "./SubComponents/SpotsLeftView";
import React, { useEffect, useState } from "react";
import { DataStore } from "aws-amplify";
import useAuthContext from "../../../hooks/useAuthContext";

interface EventMessageProps {
  message: Message;
}
export default function EventMessage(props: EventMessageProps) {
  const { message } = props;
  const { user } = useAuthContext();
  const [isMember, setIsMember] = useState<boolean>();

  /* -------------------------------------------------------------------------- */
  /*                           Is User Already Member                           */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const isUserAlreadyMember = async () => {
      const currentUserMember = (
        await DataStore.query(ChatUser, (chatUser) =>
          chatUser
            .chatID("eq", message.eventChatID ?? "")
            .userID("eq", user?.id ?? "")
        )
      )[0];

      setIsMember(!!currentUserMember);
    };

    isUserAlreadyMember();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  const hasCapacity = message.eventCapacity;
  const hasAmpleEventMembers =
    message.eventChatID && (message.eventMembersCount ?? 0) >= 3;

  return (
    <>
      {hasCapacity && (
        <SpotsLeftView eventMessage={message} isMember={isMember} />
      )}
      <EventBox eventMessage={message} isMember={isMember} />
      {hasAmpleEventMembers && <AttendeesView eventMessage={message} />}
    </>
  );
}
