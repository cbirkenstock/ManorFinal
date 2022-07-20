import { Chat, ChatUser, Message } from "../../../src/models";
import React, { useState } from "react";
import { Pressable, View, Text, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../../constants/Colors";
import { months } from "../../../constants/Months";
import { formatTime } from "../../../managers/DateTimeManager";
import { styles } from "./styles";
import useAppContext from "../../../hooks/useAppContext";
import { DataStore } from "aws-amplify";
import {
  createEventMessageComponent,
  updatedMessageEventStatus,
  uploadMessage,
} from "../../../managers/MessageManager";
import { updateChatUserOfActiveChatStatus } from "../../../managers/ChatUserManager";

interface EventSuggestionMessageProps {
  message: Message;
}

export enum EventStatus {
  pending = "pending",
  accepted = "accepted",
  rejected = "rejected",
}

export default function EventSuggestionMessage(
  props: EventSuggestionMessageProps
) {
  const { message } = props;
  const context = useAppContext();
  const { chat, members, chatUser } = context;

  let dateTime: Date = new Date(message.eventDateTime!);
  const eventDescription = message.eventDescription;

  /* -------------------------------------------------------------------------- */
  /*                             Event Color Handler                            */
  /* -------------------------------------------------------------------------- */

  const getEventColor = () => {
    switch (message.suggestionStatus) {
      case EventStatus.pending:
        return Colors.manorPurple;
      case EventStatus.accepted:
        return Colors.manorGreen;
      case EventStatus.rejected:
        return Colors.manorRed;
      default:
        return Colors.manorPurple;
    }
  };
  const [eventColor, setEventColor] = useState<string>(getEventColor());

  /* -------------------------------------------------------------------------- */
  /*                              Accept Suggestion                             */
  /* -------------------------------------------------------------------------- */

  /* ----------------------- Update Message Event Status ---------------------- */

  /* --------------------------- Make Chat Inactive --------------------------- */

  /* ---------------------- Add Event Message To Parents ---------------------- */

  const addEventMessageToParents = async () => {
    if (chat) {
      const { title, parentChat1ID, parentChat2ID } = chat;

      if (title && parentChat1ID && parentChat2ID) {
        const parentChatIDs = [parentChat1ID, parentChat2ID];

        for (const parentChatID of parentChatIDs) {
          const message = createEventMessageComponent(
            context,
            chat.title ?? "",
            dateTime,
            eventDescription ?? "",
            undefined,
            undefined,
            undefined,
            parentChatID
          );

          uploadMessage(message);
        }

        return [parentChat1ID, parentChat2ID];
      }
    }
  };

  /* ----------------------- Update Parent Last Message ----------------------- */

  const updateParentChatLastMessage = (parentChatID: string) => {
    DataStore.query(Chat, parentChatID ?? "").then((parentChat) => {
      if (parentChat) {
        DataStore.save(
          Chat.copyOf(parentChat, (updatedChat) => {
            updatedChat.lastMessage = `A new Event has been added`;
          })
        );
      }
    });
  };

  const eventSuggestionClicked = () => {
    if (message.chatuserID !== chatUser?.id) {
      Alert.alert(
        "Not For You!",
        "You suggested this event. Wait for the other group to respond to it.",
        [{ text: "Ok", style: "cancel" }]
      );
    } else {
      Alert.alert(
        "Accept Time?",
        "The Event will be added to your home group chat for everyone to see",
        [
          {
            text: "Yes!",
            onPress: acceptEventSuggestion,
          },
          {
            text: "No!",
            onPress: () => {
              return null;
            },
            style: "cancel",
          },
        ]
      );
    }
  };

  const acceptEventSuggestion = async () => {
    setEventColor(Colors.manorGreen);
    updatedMessageEventStatus(message, true);
    updateChatUserOfActiveChatStatus(members, false);
    const parentChatIDs = await addEventMessageToParents();
    if (parentChatIDs) {
      for (const parentChatID of parentChatIDs) {
        updateParentChatLastMessage(parentChatID);
      }
    }
  };

  const rejectEventSuggestion = async () => {
    setEventColor(Colors.manorRed);
    updatedMessageEventStatus(message, false);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Pressable
      style={styles.container}
      disabled={message.suggestionStatus === EventStatus.accepted}
      onPress={eventSuggestionClicked}
    >
      <LinearGradient
        colors={[eventColor, Colors.manorBackgroundGray]}
        start={[0, 0]}
        end={[0, 1]}
        style={styles.linearGradient}
      >
        <Text style={styles.monthText}>{months[dateTime.getMonth() ?? 0]}</Text>
        <View>
          <Text style={styles.dayText}>{dateTime?.getDate()}</Text>
          <Text style={styles.timeText}>{formatTime(dateTime)}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
