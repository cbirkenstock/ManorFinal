import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { animate } from "../../managers/AnimationManager";
import { Message, Reaction } from "../../src/models";
import { DataStore } from "aws-amplify";
import useAppContext from "../../hooks/useAppContext";
import { styles } from "./styles";

interface MessageReactMenuProps {
  isMe: boolean;
  visible: boolean;
  onLikeMessage: () => void;
  onDislikeMessage: () => void;
  onReaction?: () => void;
}

export default function MessageReactMenu(props: MessageReactMenuProps) {
  const { isMe, visible, onLikeMessage, onDislikeMessage, onReaction } = props;
  const messageReactHeightAnim = useRef(new Animated.Value(0)).current;
  const messageReactWidthScaleAnim = useRef(new Animated.Value(0)).current;
  const messageReactIconScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      animate(messageReactHeightAnim, 50, 150);
      animate(messageReactWidthScaleAnim, 1, 150);
      animate(messageReactIconScaleAnim, 1, 250);
    } else {
      animate(messageReactHeightAnim, 0, 200);
      animate(messageReactWidthScaleAnim, 0, 200);
      animate(messageReactIconScaleAnim, 0, 200);
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          alignSelf: isMe ? "flex-start" : "flex-end",
          height: messageReactHeightAnim,
          transform: [{ scaleX: messageReactWidthScaleAnim }],
          marginVertical: visible ? 3 : 0,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.buttonRow,
          { transform: [{ scale: messageReactIconScaleAnim }] },
        ]}
      >
        <TouchableOpacity
          disabled={!visible}
          onPress={() => {
            onLikeMessage();
            onReaction?.();
          }}
        >
          <FontAwesome name="heart" size={27} color={Colors.manorPurple} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!visible}
          onPress={() => {
            onDislikeMessage();
            onReaction?.();
          }}
        >
          <FontAwesome5 name="poop" size={27} color="#7B3F00" />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
