import React from "react";
import { Animated, StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles";
import { FontAwesome } from "@expo/vector-icons";
import CacheImage from "../../../CustomPrimitives/CacheImage";

interface ContactImageProps {
  profileImageUrl?: string | null;
  style?: StyleProp<ViewStyle>;
}
export default function contactImage(props: ContactImageProps) {
  const { profileImageUrl, style } = props;

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Animated.View style={[style]}>
      {profileImageUrl ? (
        <CacheImage
          style={[styles.container, styles.contactImage]}
          source={profileImageUrl}
          cacheKey={profileImageUrl}
        />
      ) : (
        <FontAwesome
          name="user-circle"
          size={30}
          color={"grey"}
          style={styles.container}
        />
      )}
    </Animated.View>
  );
}
