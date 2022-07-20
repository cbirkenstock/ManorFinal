import { View, TextInput, TouchableOpacity } from "react-native";
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
import { Chat } from "../../src/models";
import Colors from "../../constants/Colors";
import Dialog from "../Dialog/Dialog";
import EventSuggestionForm from "../Dialog/DialogForms/EventSuggestionForm/EventSuggestionForm";
import EventCreationForm from "../Dialog/DialogForms/EventCreationForm/EventCreationForm";
import { updateChatUserOfActiveChatStatus } from "../../managers/ChatUserManager";

interface MessageBarProps {
  chat?: Chat;
}

export default function MessageBar(props: MessageBarProps) {
  const { chat } = props;
  const { members, isForwardingEvent, setIsForwardingEvent } = useAppContext();
  const context = useAppContext();
  const [messageBody, setMessageBody] = useState<string>("");

  /* -------------------------------------------------------------------------- */
  /*                                Send Messages                               */
  /* -------------------------------------------------------------------------- */

  const sendTextMessage = async () => {
    if (messageBody) {
      const newMessage = createTextMessageComponent(messageBody, context);
      appendMessage(newMessage, context);
      uploadMessage(newMessage);
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

    const imageData = await pickMedia(PickImageRequestEnum.sendChatImage);

    if (imageData && imageData.type) {
      const newLocalMessage = createMediaMessageComponent(
        imageData.fullQualityImageMetaData.uri,
        imageData.height,
        imageData.width,
        context
      );

      appendMessage(newLocalMessage, context);

      const blob = await fetchMediaBlob(imageData.uri);
      const key = await uploadMedia(imageData.type, blob);

      const newDataMessage = createMediaMessageComponent(
        key,
        imageData.height,
        imageData.width,
        context
      );

      uploadMedia(imageData.type, blob);
      uploadMessage(newDataMessage);

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
          style={styles.TouchableOpacity}
          onPress={sendMediaMessage}
        >
          <FontAwesome5 name="camera-retro" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.TouchableOpacity, { marginRight: 5 }]}
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
          title={chat?.isCoordinationChat ? "Suggest Event" : "Create Event"}
          helperText={
            chat?.isCoordinationChat
              ? "The other group will have the ability to see and approve it"
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
          placeholder={"Chat..."}
          placeholderTextColor="#E1D9D1"
          onChangeText={(value) => {
            setMessageBody(value);
          }}
          value={messageBody}
          multiline={true}
        />
        <TouchableOpacity
          style={styles.TouchableOpacity}
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
