import React, { useState } from "react";
import { View, TextInput, Alert } from "react-native";
import Colors from "../../../../constants/Colors";
import {
  createAnnouncementComponent,
  updateLastMessage,
  UploadPendingAnnouncements,
  uploadMessage,
} from "../../../../managers/MessageManager";
import useAppContext from "../../../../hooks/useAppContext";
import ToggleButton from "../../../ToggleButton";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import FormCompletionButton from "../../../FormCompletionButton";

interface AnnouncementCreationFormProps {
  onSubmit?: () => {};
}

export default function AnnouncementCreationForm(
  props: AnnouncementCreationFormProps
) {
  const { onSubmit } = props;
  const context = useAppContext();
  const { members, chat } = context;
  const [announcementBody, setAnnouncementBody] = useState<string>();
  const [link, setLink] = useState<string>();
  const [isMandatory, setIsMandatory] = useState<boolean>(false);

  const getCopiedText = async () => {
    if (link) {
      setLink(undefined);
    } else {
      const text = await Clipboard.getStringAsync();
      setLink(text);
    }
  };

  const sendAnnouncement = () => {
    if (announcementBody) {
      const newAnnouncement = createAnnouncementComponent(
        context,
        announcementBody,
        isMandatory,
        link
      );
      uploadMessage(newAnnouncement);
      UploadPendingAnnouncements(members, newAnnouncement);
      updateLastMessage(newAnnouncement, context);
      setAnnouncementBody("");
    }
  };

  return (
    <View>
      <View
        style={{
          borderWidth: 2,
          borderColor: Colors.manorPurple,
          borderRadius: 10,
          height: 80,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            fontSize: 18,
            color: "white",
            paddingHorizontal: 7,
            paddingVertical: 2,
          }}
          multiline={true}
          placeholder={"Announcement..."}
          placeholderTextColor={"#E1D9D1"}
          selectionColor={"white"}
          value={announcementBody ?? ""}
          onChangeText={setAnnouncementBody}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 10,
        }}
      >
        <ToggleButton
          toggleStyle={{
            flex: 0.48,
            backgroundColor: link ? Colors.manorGreen : Colors.manorBlueGray,
          }}
          startAdornment={<FontAwesome5 name="link" size={20} color="white" />}
          text={"Add Link"}
          onPress={getCopiedText}
        />
        <ToggleButton
          toggleStyle={{
            flex: 0.48,
            backgroundColor: isMandatory
              ? Colors.manorGreen
              : Colors.manorBlueGray,
          }}
          startAdornment={
            <FontAwesome5 name="exclamation-circle" size={24} color="white" />
          }
          text={"Mandatory"}
          onPress={() => {
            link
              ? setIsMandatory(!isMandatory)
              : Alert.alert(
                  "Link Missing",
                  "You must add a link to a form before you can make it mandatory.",
                  [{ text: "Ok", style: "cancel" }]
                );
          }}
        />
      </View>
      <FormCompletionButton
        text="Send"
        onPress={() => {
          sendAnnouncement();
          onSubmit?.();
        }}
      />
    </View>
  );
}
