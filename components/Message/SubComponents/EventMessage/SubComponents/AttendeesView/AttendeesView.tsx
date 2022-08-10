import { DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import useAuthContext from "../../../../../../hooks/useAuthContext";
import { Chat, ChatUser, Message, User } from "../../../../../../src/models";
import SingleNameContact from "../../../../../SingleNameContact";
import { styles } from "./styles";

interface AttendeesViewProps {
  eventMessage: Message;
}

export default function AttendeesView(props: AttendeesViewProps) {
  const { eventMessage: message } = props;
  const { user } = useAuthContext();
  const [attendees, setAttendees] = useState<User[]>([user!]);

  /* -------------------------------------------------------------------------- */
  /*             FlatList & SingleNameContact Dimension Calculations            */
  /* -------------------------------------------------------------------------- */

  const flatListWidth = 0.9 * Dimensions.get("window").width;
  const firstPageNumber = 7;
  const spacing = 3;
  const flatListHeight = (flatListWidth - 7 * 3) / firstPageNumber;

  /* -------------------------------------------------------------------------- */
  /*                                Fetch Members                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchEventMembers = () => {
      DataStore.query(Chat, message.eventChatID!)
        .then((eventChat) =>
          DataStore.query(ChatUser, (chatUser) =>
            chatUser.chatID("eq", eventChat?.id ?? "")
          )
        )
        .then((eventChatMembers) =>
          eventChatMembers.map((eventChatMember) => eventChatMember.user)
        )
        .then(setAttendees);
    };

    fetchEventMembers();
  }, [message]);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <FlatList
      style={[styles.attendeeFlatList, { height: flatListHeight + 20 }]}
      horizontal={true}
      data={attendees}
      renderItem={({ item }) => (
        <SingleNameContact
          user={item}
          flatListWidth={flatListWidth}
          firstPageNumber={firstPageNumber}
          spacing={spacing}
        />
      )}
    />
  );
}
