import React, { useRef } from "react";
import { Text, Pressable, View, GestureResponderEvent } from "react-native";
import { User, Chat } from "../../src/models";
import SignedImage from "../CustomPrimitives/SignedImage";
import DefaultContactImage from "../DefaultContactImage";
import { styles } from "./styles";

interface SearchContactProps {
  contact: User | Chat;
  onPress?: ((event: GestureResponderEvent) => void) | null;
}

export default function SearchedContact(props: SearchContactProps) {
  const { contact, onPress } = props;
  const isUser = (contact as User).name;

  /* -------------------------------------------------------------------------- */
  /*                             TypeSafe Variables                             */
  /* -------------------------------------------------------------------------- */

  const image = isUser
    ? (contact as User).profileImageUrl ?? ""
    : (contact as Chat).chatImageUrl ?? "";

  const text = isUser
    ? (contact as User).name ?? ""
    : (contact as Chat).title ?? "";

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.contactImageContainer}>
        {image ? (
          <SignedImage source={image} style={styles.contactImage} />
        ) : (
          <DefaultContactImage chat={contact as Chat} />
        )}
      </View>
      <Text style={[styles.contactNameText, { marginTop: 5 }]}>
        {text.split(" ")[0]}
      </Text>
      <Text style={styles.contactNameText}>{text.split(" ")[1]}</Text>
    </Pressable>
  );
}
