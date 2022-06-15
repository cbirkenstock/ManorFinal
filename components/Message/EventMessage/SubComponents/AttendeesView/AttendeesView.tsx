import { DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import useAuthContext from "../../../../../hooks/useAuthContext";
import { Chat, ChatUser, User } from "../../../../../src/models";
import SingleNameContact from "../../../../SingleNameContact";
import { styles } from "./styles";

interface AttendeesViewProps {
  eventChat: Chat | undefined;
}

export default function AttendeesView(props: AttendeesViewProps) {
  const { eventChat } = props;
  const { user } = useAuthContext();
  const [attendees, setAttendees] = useState<User[]>([user!]);

  /* -------------------------------------------------------------------------- */
  /*             FlatList & SingleNameContact Dimension Calculations            */
  /* -------------------------------------------------------------------------- */

  const width = Dimensions.get("window").width;
  const flatListWidth = 0.9 * width;
  const firstPageNumber = 7;
  const spacing = 3;
  const flatListHeight = (flatListWidth - 7 * 3) / firstPageNumber;

  /* -------------------------------------------------------------------------- */
  /*                                Fetch Members                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchEventMembers = async () => {
      if (eventChat) {
        const eventMembers = (
          await DataStore.query(ChatUser, (chatUser) =>
            chatUser.chatID("eq", eventChat.id)
          )
        ).map((eventChatUser) => eventChatUser.user);

        setAttendees(eventMembers);
      }
    };

    fetchEventMembers();
  }, [eventChat]);

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
