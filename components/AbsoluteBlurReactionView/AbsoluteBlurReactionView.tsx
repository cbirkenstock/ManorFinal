import React from "react";
import { Pressable, View } from "react-native";
import { Message } from "../../src/models";
import MessageBubble from "../Message/SubComponents/MessageBubble";
import MessageReactMenu from "../MessageReactMenu/MessageReactMenu";
import { BlurView } from "expo-blur";

interface AbsoluteBlueReactionViewProps {
  reactionMessageAndYCoordinate: { yCoordinate: number; message: Message };
  setReactionMessageAndYCoordinate: React.Dispatch<
    React.SetStateAction<
      | {
          yCoordinate: number;
          message: Message;
        }
      | undefined
    >
  >;
}

export default function AbsoluteBlurReactionView(
  props: AbsoluteBlueReactionViewProps
) {
  const { reactionMessageAndYCoordinate, setReactionMessageAndYCoordinate } =
    props;

  const { yCoordinate, message } = reactionMessageAndYCoordinate;

  return (
    <BlurView
      intensity={50}
      tint={"dark"}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <Pressable
        onPress={() => {
          setReactionMessageAndYCoordinate(undefined);
        }}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: 5,
        }}
      >
        <View
          style={{
            maxWidth: "75%",
            alignSelf: "flex-end",
            alignItems: "flex-start",
          }}
        >
          <Pressable>
            <MessageReactMenu
              isMe={true}
              visible={true}
              message={message}
              onReaction={() => setReactionMessageAndYCoordinate(undefined)}
            />
          </Pressable>
          <MessageBubble
            style={{
              marginBottom: yCoordinate,
            }}
            message={message}
          />
        </View>
      </Pressable>
    </BlurView>
  );
}
