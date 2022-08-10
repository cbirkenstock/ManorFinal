import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import Colors from "../../../../../../constants/Colors";
import { Message } from "../../../../../../src/models";
import { months } from "../../../../../../constants/Months";
import { styles } from "./styles";
import { formatTime } from "../../../../../../managers/DateTimeManager";
import { getEventTitle } from "../../../../../../managers/EventManager";
import useAppContext from "../../../../../../hooks/useAppContext";
import { addMembers } from "../../../../../../managers/ChatManager";
import useAuthContext from "../../../../../../hooks/useAuthContext";
import { updateEventMessageMembersCount } from "../../../../../../managers/MessageManager";

interface EventMessageProps {
  eventMessage: Message;
  isMember: Boolean | undefined;
}

export default function EventBox(props: EventMessageProps) {
  const { eventMessage, isMember } = props;
  const { user } = useAuthContext();
  const { chat, messages, setMessages } = useAppContext();
  const dateTime = eventMessage.eventDateTime
    ? new Date(eventMessage.eventDateTime)
    : new Date();

  /* -------------------------------------------------------------------------- */
  /*                               Sub-Components                               */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------- DateIcon -------------------------------- */

  const DateIcon = () => {
    return (
      <View style={styles.dateIconContainer}>
        <LinearGradient
          colors={[
            isMember
              ? Colors.manorGreen
              : eventMessage.eventMembersCount === eventMessage.eventCapacity
              ? Colors.manorRed
              : Colors.manorPurple,
            Colors.manorBackgroundGray,
          ]}
          start={[0, 0]}
          end={[0, 1]}
          style={styles.dateIconLinearGradient}
        >
          <Text style={styles.dateIconSmallText}>
            {months[dateTime?.getMonth() ?? 0]}{" "}
          </Text>
          <Text style={styles.dateIconLargeText}>{dateTime?.getDate()}</Text>
          <Text style={styles.dateIconSmallText}>{formatTime(dateTime)}</Text>
        </LinearGradient>
      </View>
    );
  };

  /* ---------------------------- Event Information --------------------------- */

  const EventInformation = () => {
    return (
      <View
        style={[
          styles.eventInformationContainer,
          {
            justifyContent: eventMessage?.eventDescription
              ? "space-between"
              : "center",
          },
        ]}
      >
        <Text style={styles.eventInfoTitleText}>
          {getEventTitle(eventMessage, chat ?? undefined)}
        </Text>

        {eventMessage?.eventDescription ? (
          <Text style={styles.eventInfoEventDescription}>
            {eventMessage?.eventDescription}
          </Text>
        ) : null}
      </View>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                        Event Message Clicked Handler                       */
  /* -------------------------------------------------------------------------- */

  /* ----------------------- Fetch Event Member User IDs ---------------------- */

  /* ------------------------------- Join Event ------------------------------- */

  const joinEvent = async () => {
    await addMembers(
      undefined,
      eventMessage.eventChatID ?? undefined,
      user ? [user] : undefined
    );

    updateEventMessageMembersCount(
      eventMessage,
      (eventMessage.eventMembersCount ?? 0) + 1
    );
  };

  /* ------------------------------ Event Clicked ----------------------------- */

  const EventMessageClicked = async () => {
    if (isMember) {
      Alert.alert("Already Joined", "You've already joined this event.", [
        { text: "Ok", style: "cancel" },
      ]);
    } else {
      Alert.alert("Join Event?", "", [
        { text: "Join", onPress: joinEvent },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <TouchableOpacity
      disabled={!eventMessage.eventChatID}
      onPress={EventMessageClicked}
    >
      <View style={styles.eventBox}>
        <DateIcon />
        <EventInformation />
      </View>
    </TouchableOpacity>
  );
}
