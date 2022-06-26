import React, { useRef } from "react";
import { Animated } from "react-native";
import { styles } from "./styles";
import { FontAwesome } from "@expo/vector-icons";
import SignedImage from "../../../components/CustomPrimitives/SignedImage";

interface ContactImageProps {
  profileImageUrl?: string | null;
}
export default function contactImage(props: ContactImageProps) {
  const { profileImageUrl } = props;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Animated.View style={{ opacity: opacityAnim }}>
      {profileImageUrl ? (
        <SignedImage
          style={[styles.container, styles.contactImage]}
          source={profileImageUrl}
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
