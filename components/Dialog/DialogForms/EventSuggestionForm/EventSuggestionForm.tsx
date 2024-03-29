import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, TextInput, View } from "react-native";

import Colors from "../../../../constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import useAppContext from "../../../../hooks/useAppContext";
import {
  appendMessage,
  createEventSuggestionComponent,
  createTimeCardComponent,
  updateLastMessage,
  uploadMessage,
} from "../../../../managers/MessageManager";
import { updateChatUserOfActiveChatStatus } from "../../../../managers/ChatUserManager";
import SectionInput from "../../../SectionInput/SectionInput";
import { dayHasPassed } from "../../../../managers/DateTimeManager";
import { Message } from "../../../../src/models";

interface EventSuggestionFormProps {
  onSubmit?: () => any;
}

export default function EventSuggestionForm(props: EventSuggestionFormProps) {
  const { onSubmit } = props;
  const context = useAppContext();
  const {
    messages,
    members,
    eventDateTime,
    setEventDateTime,
    eventDescription,
    setEventDescription,
  } = context;

  const suggestEvent = async () => {
    if (eventDateTime) {
      let newMessage = createEventSuggestionComponent(
        context,
        eventDateTime.toISOString(),
        eventDescription ?? undefined
      );

      if (dayHasPassed(messages[0]?.createdAt ?? undefined)) {
        const timeCard = createTimeCardComponent(new Date(), context);
        newMessage = new Message({ ...newMessage, marginTop: 10 });
        appendMessage(newMessage, context, timeCard);
        uploadMessage(timeCard);
      } else {
        appendMessage(newMessage, context);
      }

      uploadMessage(newMessage);
      updateLastMessage("A new event has been suggested", context);

      updateChatUserOfActiveChatStatus(members, true);
    }
  };

  return (
    <>
      <SectionInput
        containerStyle={{ paddingVertical: 5, marginBottom: 10 }}
        caption="Date"
        children={
          <DateTimePicker
            style={{ width: 210 }}
            value={eventDateTime ?? new Date()}
            mode={"datetime"}
            accentColor={Colors.manorPurple}
            textColor="white"
            themeVariant="dark"
            onChange={(_, date) => {
              if (date) {
                setEventDateTime(date);
              }
            }}
          />
        }
      />

      <View
        style={{
          borderWidth: 2,
          borderColor: Colors.manorPurple,
          borderRadius: 10,
          marginBottom: 10,
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
          keyboardAppearance="dark"
          multiline={true}
          placeholder={"Event Description..."}
          placeholderTextColor={"#E1D9D1"}
          selectionColor={"white"}
          value={eventDescription ?? ""}
          onChangeText={setEventDescription}
        />
      </View>

      <TouchableOpacity
        style={{
          borderRadius: 20,
          padding: 10,
          backgroundColor: Colors.manorPurple,
        }}
        onPress={() => {
          suggestEvent();
          onSubmit?.();
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Send
        </Text>
      </TouchableOpacity>
    </>
  );
}
