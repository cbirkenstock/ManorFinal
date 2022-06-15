import React from "react";
import { View, Text } from "react-native";
import Colors from "../../../../../constants/Colors";
import useAppContext from "../../../../../hooks/useAppContext";
import { Message } from "../../../../../src/models";
import { styles } from "./styles";

interface SpotsLeftViewProps {
  message: Message;
  limit: number;
  membersCount: number;
}

export default function SpotsLeftView(props: SpotsLeftViewProps) {
  const { chatUser } = useAppContext();
  const { message, limit, membersCount } = props;
  const isMe = chatUser?.id !== message.chatuserID;

  /* -------------------------------------------------------------------------- */
  /*                            Spots Left Calculator                           */
  /* -------------------------------------------------------------------------- */

  let spotsLeft: number;
  if (limit > membersCount) {
    spotsLeft = limit - membersCount;
  } else {
    spotsLeft = 0;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View style={styles.spotsLeftContainer}>
      {limit ? (
        <>
          <Text
            style={[
              styles.spotCountText,
              { color: spotsLeft > 0 ? Colors.manorGreen : Colors.manorRed },
            ]}
          >
            {spotsLeft}
          </Text>
          <Text style={styles.fillerText}>Spots Left!</Text>
        </>
      ) : null}
      {isMe ? <Text style={styles.fillerText}>Click to Join Event</Text> : null}
    </View>
  );
}
