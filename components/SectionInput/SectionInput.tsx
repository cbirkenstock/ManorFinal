import "react-native-gesture-handler";
import React, { useState } from "react";
import { StyleProp, Text, TextInput, View, ViewStyle } from "react-native";
import "react-native-get-random-values";
import Colors from "../../constants/Colors";
import { styles } from "./styles";

export interface SectionInputProps {
  caption: string;
  info?: string;
  value?: string;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  editable?: boolean;
  numericKeyboard?: boolean;
  onSubmit?: (input: string) => any;
  onChangeText?: (input: string) => any;
}

export default function SectionInput(props: SectionInputProps) {
  const {
    caption,
    value,
    info,
    children,
    containerStyle,
    editable,
    numericKeyboard,
    onSubmit,
    onChangeText,
  } = props;

  let currentInfo = typeof info === "string" ? info : "";

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.text}>{`${caption}:`}</Text>
      {info && (
        <TextInput
          placeholderTextColor={editable ? "white" : Colors.manorDarkWhite}
          style={styles.input}
          keyboardAppearance="dark"
          placeholder={info}
          editable={editable}
          maxLength={numericKeyboard ? 4 : 30}
          returnKeyType="done"
          onSubmitEditing={() => onSubmit?.(currentInfo)}
          onChangeText={(value) => {
            currentInfo = value;
            onChangeText?.(currentInfo);
          }}
          value={value}
          keyboardType={numericKeyboard ? "numeric" : "default"}
        />
      )}
      {children}
    </View>
  );
}
