import React from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import { styles } from "./styles";
import CacheImage from "../../../CustomPrimitives/CacheImage";
import Avatar from "../../../Avatar";
import { ChatUser } from "../../../../src/models";

interface ContactImageProps {
  sender?: ChatUser;
  style?: StyleProp<ViewStyle>;
}
export default function contactImage(props: ContactImageProps) {
  const { sender, style } = props;

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Animated.View style={[style]}>
      {sender?.profileImageUrl ? (
        <CacheImage
          style={[styles.container, styles.contactImage]}
          source={sender?.profileImageUrl}
          cacheKey={sender?.profileImageUrl}
        />
      ) : (
        <Avatar chatUser={sender} dimensions={30} fontSize={14} />
      )}
    </Animated.View>
  );
}
