import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { animate } from "../../managers/AnimationManager";
import { Message, Reaction } from "../../src/models";
import { DataStore } from "aws-amplify";
import useAppContext from "../../hooks/useAppContext";

interface MessageReactMenuProps {
  isMe: boolean;
  visible: boolean;
  onLikeMessage: () => Promise<void>;
  onReaction: () => void;
}

export default function MessageReactMenu(props: MessageReactMenuProps) {
  const { isMe, visible, onLikeMessage, onReaction } = props;
  const messageReactScaleAnim = useRef(new Animated.Value(0)).current;
  const messageReactIconOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      animate(messageReactScaleAnim, 1, 300);
      animate(messageReactIconOpacityAnim, 1, 500);
    } else {
      animate(messageReactScaleAnim, 0, 300);
      animate(messageReactIconOpacityAnim, 0, 300);
    }
  }, [visible]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        backgroundColor: Colors.manorBlueGray,
        borderRadius: 25,
        zIndex: 1000,
        top: -50,
        transform: [{ scaleX: messageReactScaleAnim }],
        width: 90,
        right: isMe ? 0 : undefined,
        left: !isMe ? 0 : undefined,

        paddingVertical: 10,
        paddingHorizontal: 15,
      }}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          opacity: messageReactIconOpacityAnim,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            onLikeMessage();
            onReaction();
          }}
        >
          <FontAwesome name="heart" size={26} color={Colors.manorPurple} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="poop" size={26} color="#7B3F00" />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
