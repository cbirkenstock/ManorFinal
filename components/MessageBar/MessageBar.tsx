import { View, TextInput, TouchableOpacity, Alert } from "react-native";
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

interface MessageBarProps {
  chat?: Chat;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[] | undefined>>;
  messageToReplyTo?: Message;
}

export default function MessageBar(props: MessageBarProps) {
  const { chat, chats, setChats, messageToReplyTo } = props;
  const context = useAppContext();
  const { chatUser, members, isForwardingEvent, setIsForwardingEvent } =
    context;
  const { user } = useAuthContext();

  const [messageBody, setMessageBody] = useState<string>("");

  /* -------------------------------------------------------------------------- */
  /*                                Send Messages                               */
  /* -------------------------------------------------------------------------- */

  const sendTextMessage = async () => {
    if (messageBody) {
      let urlPreviewTitle: string | undefined = undefined;
      let urlPreviewWebsiteUrl: string | undefined = undefined;
      let urlPreviewImageUrl: string | undefined = undefined;

      if (ContainsUrl(messageBody)) {
        let webData = await extractWebInfo(messageBody);

        urlPreviewTitle = (webData as any).title;
        urlPreviewWebsiteUrl = (webData as any).url;
        urlPreviewImageUrl = (webData as any).images[0];
      }

      const newMessage = createTextMessageComponent(
        messageBody,
        context,
        messageToReplyTo,
        urlPreviewTitle,
        urlPreviewWebsiteUrl,
        urlPreviewImageUrl
      );

      appendMessage(newMessage, context);
      setChats(reOrderChats(chat, chats, newMessage.messageBody ?? undefined));
      await uploadMessage(newMessage);
      sendNotification(user ?? undefined, chat, members, newMessage, false);
      updateChatUserHasUnreadMessages(
        members.filter((member) => member.id !== chatUser?.id),
        true
      );
      updateLastMessage(newMessage, context);
      setMessageBody("");

      if (chat?.isCoordinationChat) {
        updateChatUserOfActiveChatStatus(members, true);
      }
    }
  };

  /*
  This function creates a local message with full resolution image and appends
  to flatlist so sender can see that -- then manipulated mediaMessage is created,
  the media is uploaded to s3, and the message is uploaded to the db
  */
  const sendMediaMessage = async () => {
    requestCameraPermissionsAsync();

    const mediaData = await pickMedia(PickImageRequestEnum.sendChatImage);

    if (mediaData && mediaData.type) {
      const newLocalMessage = createMediaMessageComponent(
        mediaData.fullQualityImageMetaData.uri,
        mediaData.height,
        mediaData.width,
        context
      );

      appendMessage(newLocalMessage, context);

      const blob = await fetchMediaBlob(mediaData.uri);
      const key = await uploadMedia(mediaData.type, blob);

      const newDataMessage = createMediaMessageComponent(
        key,
        mediaData.height,
        mediaData.width,
        context
      );

      uploadMedia(mediaData.type, blob);
      await uploadMessage(newDataMessage);
      sendNotification(user ?? undefined, chat, members, newDataMessage, false);
      updateChatUserHasUnreadMessages(members, true);

      if (chat?.isCoordinationChat) {
        updateChatUserOfActiveChatStatus(members, true);
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.TouchableOpacity, { marginBottom: 4 }]}
          onPress={sendMediaMessage}
        >
          <FontAwesome5 name="camera-retro" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.TouchableOpacity,
            { marginRight: 5, marginBottom: 2.5 },
          ]}
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
    </>
  );
}
