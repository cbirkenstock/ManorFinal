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

export interface SectionInputProps {
  caption: string;
  info: string | undefined;
  editable?: boolean;
  onSubmit?: (input: string) => any;
}

export default function SectionInput(props: SectionInputProps) {
  const { caption, info, editable, onSubmit } = props;
  let currentInfo = info ?? "";

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
        onSubmitEditing={onSubmit && (() => onSubmit(currentInfo))}
        onChangeText={(value) => {
          currentInfo = value;
        }}
      />
    </Pressable>
  );
}
