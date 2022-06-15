import React, { useEffect, useRef, useState } from "react";
import { Text, Image, TouchableOpacity, Animated } from "react-native";
import { fetchSignedUrl } from "../../managers/MediaManager";
import { User } from "../../src/models";
import { styles } from "./styles";
import { animate } from "../../managers/AnimationManager";

interface SingleNameContactProps {
  user: User;
  onPress?: () => {};
  flatListWidth: number;
  firstPageNumber: number;
  spacing: number;
}
export default function ChosenName(props: SingleNameContactProps) {
  const {
    user,
    onPress,
    flatListWidth,
    firstPageNumber: amountImmediatelyVisible,
    spacing,
  } = props;
  const [signedUrl, setSignedUrl] = useState<string>();
  const firstName = user.name.split(" ")[0];
  const opacityAnim = useRef(new Animated.Value(0)).current;

  /* -------------------------------------------------------------------------- */
  /*                         Calculate Image Dimensions                         */
  /* -------------------------------------------------------------------------- */

  const formattedFlatListWidth =
    flatListWidth - spacing * amountImmediatelyVisible;

  const dimensions = formattedFlatListWidth / amountImmediatelyVisible;

  /* -------------------------------------------------------------------------- */
  /*                               Fetch SignedUrl                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (user?.profileImageUrl) {
      fetchSignedUrl(user?.profileImageUrl).then((_signedUrl) =>
        setSignedUrl(_signedUrl)
      );
    }
  }, [user]);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <TouchableOpacity
      style={[styles.container, { marginRight: spacing }]}
      onPress={onPress}
    >
      <Animated.Image
        source={{ uri: signedUrl }}
        onLoad={() => animate(opacityAnim, 1, 500)}
        style={{
          height: dimensions,
          width: dimensions,
          borderRadius: dimensions / 2,
          opacity: opacityAnim,
        }}
      />
      <Animated.Text
        numberOfLines={1}
        style={[styles.contactNameText, { opacity: opacityAnim }]}
      >
        {firstName}
      </Animated.Text>
    </TouchableOpacity>
  );
}
