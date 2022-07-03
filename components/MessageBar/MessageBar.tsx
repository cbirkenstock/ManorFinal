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

export default function MessageBar() {
  const context = useAppContext();
  const [messageBody, setMessageBody] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                                Send Messages                               */
  /* -------------------------------------------------------------------------- */

  const sendTextMessage = async () => {
    const newMessage = createTextMessageComponent(messageBody, context);
    appendMessage(newMessage, context);
    uploadMessage(newMessage);
    updateLastMessage(newMessage, context);
    setMessageBody("");
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
        <TouchableOpacity style={[styles.TouchableOpacity, { marginRight: 5 }]}>
          <FontAwesome5
            name="calendar-alt"
            size={26}
            color="white"
            style={{ marginBottom: 2 }}
          />
        </TouchableOpacity>
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
