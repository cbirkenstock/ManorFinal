import React, { useRef } from "react";
import {
  TouchableOpacity,
  Animated,
  Text,
  GestureResponderEvent,
} from "react-native";
import { User } from "../../src/models";
import { styles } from "./styles";
import SignedImage from "../CustomPrimitives/SignedImage";

interface SingleNameContactProps {
  user: User;
  onPress?: (event: GestureResponderEvent) => void;
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
  const firstName = user.name.split(" ")[0];
  const opacityAnim = useRef(new Animated.Value(0)).current;

  /* -------------------------------------------------------------------------- */
  /*                         Calculate Image Dimensions                         */
  /* -------------------------------------------------------------------------- */

  const formattedFlatListWidth =
    flatListWidth - spacing * amountImmediatelyVisible;

  const dimensions = formattedFlatListWidth / amountImmediatelyVisible;

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Animated.View style={{ opacity: opacityAnim }}>
      <TouchableOpacity
        style={[styles.container, { marginRight: spacing }]}
        onPress={onPress}
      >
        <SignedImage
          source={user?.profileImageUrl}
          opacityAnim={opacityAnim}
          duration={150}
          style={{
            height: dimensions,
            width: dimensions,
            borderRadius: dimensions / 2,
          }}
        />
        <Text numberOfLines={1} style={[styles.contactNameText]}>
          {firstName}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
