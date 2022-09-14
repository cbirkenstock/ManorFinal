import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Send } from "react-native-feather";
import useAppContext from "../../hooks/useAppContext";
import { styles } from "./styles";
import {
  createTextMessageComponent,
  createMediaMessageComponent,
  appendMessage,
  uploadMessage,
  updateLastMessage,
  createTimeCardComponent,
} from "../../managers/MessageManager";
import { requestCameraPermissionsAsync } from "expo-image-picker";
import {
  PickImageRequestEnum,
  pickMedia,
  fetchMediaBlob,
  uploadMedia,
} from "../../managers/MediaManager";
import { Chat, Message } from "../../src/models";
import Colors from "../../constants/Colors";
import Dialog from "../Dialog/Dialog";
import EventSuggestionForm from "../Dialog/DialogForms/EventSuggestionForm/EventSuggestionForm";
import EventCreationForm from "../Dialog/DialogForms/EventCreationForm/EventCreationForm";
import {
  updateChatUserHasUnreadMessages,
  updateChatUserOfActiveChatStatus,
} from "../../managers/ChatUserManager";
import { sendNotification } from "../../managers/NotificationManager";
import useAuthContext from "../../hooks/useAuthContext";
import { reOrderChats } from "../../managers/ChatManager";
import { ContainsUrl, extractWebInfo } from "../../managers/UrlPreviewManager";
import { dayHasPassed } from "../../managers/DateTimeManager";

interface MessageBarProps {
  chat?: Chat;
  messageToReplyTo?: Message;
  threadMessages?: Message[];
  setThreadMessages: React.Dispatch<
    React.SetStateAction<Message[] | undefined>
  >;
  style?: StyleProp<ViewStyle>;
}

export default function MessageBar(props: MessageBarProps) {
  const { chat, messageToReplyTo, threadMessages, setThreadMessages, style } =
    props;
  const context = useAppContext();
  const {
    chatUser,
    members,
    messages,
    isForwardingEvent,
    setIsForwardingEvent,
  } = context;
  const { user } = useAuthContext();

  const [messageBody, setMessageBody] = useState<string>("");

  /* -------------------------------------------------------------------------- */
  /*                                Send Messages                               */
  /* -------------------------------------------------------------------------- */

  const sendTextMessage = async () => {
    if (chat?.isDeactivated) {
      Alert.alert(
        "This chat has been disabled. This can be the case for several reasons, including the other user deleting their account."
      );
      return;
    }

    if (!messageBody) return;

    setMessageBody("");

    let urlPreviewTitle = undefined;
    let urlPreviewWebsiteUrl = undefined;
    let urlPreviewImageUrl = undefined;

    if (ContainsUrl(messageBody)) {
      let webData = await extractWebInfo(messageBody);

      urlPreviewTitle = (webData as any).title;
      urlPreviewWebsiteUrl = (webData as any).url;
      urlPreviewImageUrl = (webData as any).images[0];
    }

    const messageToReplyToSenderName = members.find(
      (member) => member.id === messageToReplyTo?.chatuserID
    )?.user.name;

    let newMessage = createTextMessageComponent(
      messageBody,
      context,
      messageToReplyTo,
      messageToReplyToSenderName,
      urlPreviewTitle,
      urlPreviewWebsiteUrl,
      urlPreviewImageUrl
    );

    threadMessages && setThreadMessages([newMessage, ...threadMessages]);

    if (dayHasPassed(messages[0]?.createdAt ?? undefined)) {
      const timeCard = createTimeCardComponent(new Date(), context);
      newMessage = new Message({ ...newMessage, marginTop: 10 });
      appendMessage(newMessage, context, timeCard);
      uploadMessage(timeCard);
    } else {
      appendMessage(newMessage, context);
    }

    await uploadMessage(newMessage);
    sendNotification(user ?? undefined, chat, members, newMessage, false);
    // messages.slice(-15),
    updateChatUserHasUnreadMessages(
      members.filter((member) => member.id !== chatUser?.id)
    );
    updateLastMessage(newMessage.messageBody ?? "", context);

    updateChatUserOfActiveChatStatus(members, true);
  };

  /*
  This function creates a local message with full resolution image and appends
  to flatlist so sender can see that -- then manipulated mediaMessage is created,
  the media is uploaded to s3, and the message is uploaded to the db
  */
  const sendMediaMessage = async () => {
    if (chat?.isDeactivated) {
      Alert.alert(
        "The other user has deleted their account. Messages can no longer be sent in this chat."
      );

      return;
    }

    requestCameraPermissionsAsync();

    const mediaData = await pickMedia(PickImageRequestEnum.sendChatImage);

    if (mediaData && mediaData.type) {
      let newLocalMessage = createMediaMessageComponent(
        mediaData.fullQualityImageMetaData.uri,
        mediaData.height,
        mediaData.width,
        context
      );

      threadMessages && setThreadMessages([newLocalMessage, ...threadMessages]);

      if (dayHasPassed(messages[0]?.createdAt ?? undefined)) {
        const timeCard = createTimeCardComponent(new Date(), context);
        newLocalMessage = new Message({ ...newLocalMessage, marginTop: 10 });
        appendMessage(newLocalMessage, context, timeCard);
        uploadMessage(timeCard);
      } else {
        appendMessage(newLocalMessage, context);
      }

      const blob = await fetchMediaBlob(mediaData.uri);
      const key = await uploadMedia(mediaData.type, blob);

      const newDataMessage = new Message({ ...newLocalMessage, imageUrl: key });

      uploadMedia(mediaData.type, blob);
      uploadMessage(newDataMessage);
      sendNotification(user ?? undefined, chat, members, newDataMessage, false);
      updateChatUserHasUnreadMessages(members);

      updateChatUserOfActiveChatStatus(members, true);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.TouchableOpacity, { marginBottom: 4 }]}
        onPress={sendMediaMessage}
      >
        <FontAwesome5 name="camera-retro" size={25} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.TouchableOpacity, { marginRight: 5, marginBottom: 2.5 }]}
        onPress={() => setIsForwardingEvent(true)}
      >
        <FontAwesome5
          name={chat?.isCoordinationChat ? "calendar-plus" : "calendar-alt"}
          size={28}
          color={chat?.isCoordinationChat ? Colors.manorPurple : "white"}
          style={{ marginBottom: 2 }}
        />
      </TouchableOpacity>
      <Dialog
        visible={isForwardingEvent}
        onClose={() => setIsForwardingEvent(false)}
        marginTop={"15%"}
        width={350}
        title={chat?.isCoordinationChat ? "Suggest Event" : "Add Event"}
        helperText={
          chat?.isCoordinationChat
            ? "The other group will be able to approve it"
            : undefined
        }
      >
        {chat?.isCoordinationChat ? (
          <EventSuggestionForm onSubmit={() => setIsForwardingEvent(false)} />
        ) : (
          <EventCreationForm />
        )}
      </Dialog>
      <TextInput
        style={styles.messageBar}
        keyboardAppearance="dark"
        placeholder={"Chat..."}
        placeholderTextColor="#E1D9D1"
        onChangeText={(value) => {
          setMessageBody(value);
        }}
        value={messageBody}
        multiline={true}
      />
      <TouchableOpacity
        style={[styles.TouchableOpacity, { marginBottom: 3 }]}
        onPress={() => {
          sendTextMessage();
        }}
      >
        <Send width={28} height={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
