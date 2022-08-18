import React from "react";
import { View, Text } from "react-native";
import Colors from "../../../../../../constants/Colors";
import useAppContext from "../../../../../../hooks/useAppContext";
import { Message } from "../../../../../../src/models";
import { styles } from "./styles";

interface SpotsLeftViewProps {
  eventMessage: Message;
  isMember: Boolean | undefined;
}

export default function SpotsLeftView(props: SpotsLeftViewProps) {
  const { eventMessage, isMember } = props;

  /* -------------------------------------------------------------------------- */
  /*                            Spots Left Calculator                           */
  /* -------------------------------------------------------------------------- */

  let spotsLeft: number = 0;

  if (
    eventMessage.eventCapacity &&
    eventMessage.eventMembersCount !== undefined &&
    eventMessage.eventMembersCount !== null
  ) {
    if (eventMessage.eventCapacity > eventMessage.eventMembersCount) {
      spotsLeft = eventMessage.eventCapacity - eventMessage.eventMembersCount;
    } else {
      spotsLeft = 0;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View style={styles.spotsLeftContainer}>
      {eventMessage.eventCapacity ? (
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
      {!isMember && spotsLeft > 0 ? (
        <Text style={styles.fillerText}>Click to Join Event</Text>
      ) : null}
    </View>
  );
}
