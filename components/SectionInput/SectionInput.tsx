import "react-native-gesture-handler";
import React, { useState } from "react";
import { Text, TextInput, Pressable } from "react-native";
import { DataStore } from "@aws-amplify/datastore";
import { User } from "../../src/models";
import "react-native-get-random-values";
import Colors from "../../constants/Colors";
import useAuthContext from "../../hooks/useAuthContext";
import { styles } from "./styles";
import LoginScreen from "../../screens/AuthScreens/LoginScreen";

/*
  I chose SectionInputEnum instead of regular string since even though
  we usually prefer openess with abstracted components, since the Logic
  is handled internally, we need to be typsafe to ensure onSubmit is handled 
  correctly
*/
export enum SectionInputEnum {
  name = "Name",
  phone = "Phone",
  venmoHandle = "Venmo Handle",
}

export interface SectionInputProps {
  caption: SectionInputEnum;
  info: string | undefined;
  editable?: boolean;
}

export default function SectionInput(props: SectionInputProps) {
  const { caption, info, editable } = props;
  const { user, setUser } = useAuthContext();
  let currentInfo = info ?? "";

  /* -------------------------------------------------------------------------- */
  /*                                   Submit                                   */
  /* -------------------------------------------------------------------------- */

  /*
  The only reason the functions are handled internally here instead of being
  passed in is becuase they rely on internal state of component itself so it's
  less complex
  */

  const updateInfo = async () => {
    const upToDateUser = await DataStore.query(User, user?.id ?? "");

    if (upToDateUser) {
      switch (caption) {
        case SectionInputEnum.venmoHandle:
          const updatedUser = await DataStore.save(
            User.copyOf(upToDateUser, (updatedUser) => {
              updatedUser.venmoHandle = currentInfo;
            })
          );

          setUser(updatedUser);
          break;
        default:
          break;
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Pressable style={styles.container}>
      <Text style={styles.text}>{`${caption}:`}</Text>
      <TextInput
        placeholderTextColor={editable ? "white" : Colors.manorDarkWhite}
        style={styles.input}
        placeholder={info}
        editable={editable}
        maxLength={30}
        returnKeyType="done"
        onSubmitEditing={updateInfo}
        onChangeText={(value) => {
          currentInfo = value;
        }}
      />
    </Pressable>
  );
}
