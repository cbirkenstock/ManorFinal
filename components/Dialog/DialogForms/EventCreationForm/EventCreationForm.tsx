import React from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "../../../../constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import SectionInput from "../../../SectionInput/SectionInput";
import {
  appendMessage,
  createEventMessageComponent,
  updateLastMessage,
  uploadMessage,
} from "../../../../managers/MessageManager";
import useAppContext from "../../../../hooks/useAppContext";
import ToggleButton from "../../../ToggleButton";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { InnerCreateEventFormNavigationProps } from "../../../../navigation/NavTypes";
import { createGroupChat } from "../../../../managers/ChatManager";
import useAuthContext from "../../../../hooks/useAuthContext";

export default function EventCreationForm() {
  const { user } = useAuthContext();
  const context = useAppContext();
  const {
    eventTitle,
    setEventTitle,
    eventDateTime,
    setEventDateTime,
    eventLocation,
    addEventChat,
    setAddEventChat,
    eventCapacity,
    setEventCapacity,
    eventDescription,
    setEventDescription,
    setIsForwardingEvent,
  } = context;
  const navigation = useNavigation<InnerCreateEventFormNavigationProps>();

  const createEvent = async () => {
    if (eventTitle) {
      let newEventChat;
      if (addEventChat && user) {
        newEventChat = (
          await createGroupChat(false, true, eventTitle, [], undefined, user)
        )?.chat;
      }

      const newEventMessage = createEventMessageComponent(
        context,
        eventTitle,
        eventDateTime ?? new Date(),
        eventDescription ?? undefined,
        eventLocation ?? undefined,
        eventCapacity ? parseInt(eventCapacity) : undefined,
        newEventChat ? newEventChat.id : undefined
      );
      appendMessage(newEventMessage, context);
      uploadMessage(newEventMessage);
      updateLastMessage(newEventMessage, context);
      setIsForwardingEvent?.(false);
    }
  };

  /*
  for section inputs here I have an explicit value component that hooks into the component. 
  Even though the section input has the onChangeTextFunction and can handle internal state,
  which makes it easier becuase you generally don't have to create a variable in the parent 
  component everytime you use the component, in this case we need it becuase the form
  is removed from the DOM and therefore will reset internal state -- in this rare case
  we need external state to be fed through so it remembers
  */
  return (
    <>
      <SectionInput
        containerStyle={styles.titleContainer}
        caption="Title"
        info={"Event Title"}
        value={eventTitle ?? ""}
        onChangeText={setEventTitle}
      />

      <SectionInput
        containerStyle={styles.dateContainer}
        caption="Date"
        children={
          <DateTimePicker
            style={{ width: 210 }}
            accentColor={Colors.manorPurple}
            themeVariant="dark"
            value={eventDateTime ?? new Date()}
            mode={"datetime"}
            onChange={(_, date) => {
              if (date) {
                setEventDateTime(date);
              }
            }}
          />
        }
      />

      <View style={styles.rowButtonContainer}>
        <ToggleButton
          toggleStyle={[
            styles.toggleButtonContainer,
            {
              backgroundColor: eventLocation
                ? Colors.manorGreen
                : Colors.manorBlueGray,
            },
          ]}
          text="Add Location"
          onPress={() => {
            setIsForwardingEvent?.(false);
            navigation.navigate("GoogleMapsScreen", {
              link: undefined,
            });
          }}
          startAdornment={
            <FontAwesome name="hand-stop-o" size={20} color="white" />
          }
        />
        <ToggleButton
          toggleStyle={[
            styles.toggleButtonContainer,
            {
              backgroundColor: addEventChat
                ? Colors.manorGreen
                : Colors.manorBlueGray,
            },
          ]}
          text="Add Chat"
          onPress={() => setAddEventChat(!addEventChat)}
          startAdornment={
            <Ionicons name="ios-chatbubble-outline" size={23} color="white" />
          }
        />
      </View>

      <SectionInput
        caption="Event Capacity"
        info={"Event Capacity"}
        value={eventCapacity ?? ""}
        numericKeyboard
        onChangeText={(input) => setEventCapacity(input)}
      />

      <View style={styles.descriptionView}>
        <TextInput
          style={styles.descriptionTextInput}
          multiline={true}
          placeholder={"Event Description..."}
          placeholderTextColor={"#E1D9D1"}
          selectionColor={"white"}
          value={eventDescription ?? ""}
          onChangeText={setEventDescription}
        />
      </View>
      <Pressable style={styles.createEventButton} onPress={createEvent}>
        <Text style={styles.createEventButtonText}>Create</Text>
      </Pressable>
    </>
  );
}
