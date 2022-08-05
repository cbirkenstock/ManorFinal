import React, { useRef } from "react";
import { Animated, Image } from "react-native";
import { styles } from "./styles";
import { FontAwesome } from "@expo/vector-icons";
import SignedImage from "../../../components/CustomPrimitives/SignedImage";
import CacheImage from "../../CustomPrimitives/CacheImage";

interface ContactImageProps {
  profileImageUrl?: string | null;
}
export default function contactImage(props: ContactImageProps) {
  const { profileImageUrl } = props;

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  //if decided later, can permanently remove wrapper view for opacity anim
  return (
    <Animated.View style={{ opacity: 1 }}>
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
