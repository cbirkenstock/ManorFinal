import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, Text } from "react-native";
import Colors from "../../../../constants/Colors";
import { animate } from "../../../../managers/AnimationManager";

interface MessageReactMenuProps {
  isMe: boolean;
  visible: boolean;
  onPress: () => void;
  onReaction?: () => void;
}

export default function MessageReactMenu(props: MessageReactMenuProps) {
  const { isMe, visible, onPress, onReaction } = props;
  const replyButtonHeightAnim = useRef(new Animated.Value(0)).current;
  const replyButtonWidthScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      animate(replyButtonHeightAnim, 35, 150);
      animate(replyButtonWidthScaleAnim, 1, 150);
    } else {
      animate(replyButtonHeightAnim, 0, 200);
      animate(replyButtonWidthScaleAnim, 0, 200);
    }
  }, [visible]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View
        style={[
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: 65,
            borderRadius: 100,
            backgroundColor: Colors.manorBlueGray,
            alignSelf: isMe ? "flex-start" : "flex-end",
            height: replyButtonHeightAnim,
            transform: [{ scaleX: replyButtonWidthScaleAnim }],
            marginVertical: visible ? 3 : 0,
          },
        ]}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
          Reply
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
