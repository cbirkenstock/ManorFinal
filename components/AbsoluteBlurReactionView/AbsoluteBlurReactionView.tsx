import React from "react";
import { Pressable, View } from "react-native";
import { Message } from "../../src/models";
import MessageBubble from "../Message/SubComponents/MessageBubble";
import MessageReactMenu from "../MessageReactMenu/MessageReactMenu";
import { BlurView } from "expo-blur";
import useAppContext from "../../hooks/useAppContext";
import ResponseMessage from "../Message/SubComponents/ResponseMessage/ResponseMessage";
import UrlPreviewMessage from "../Message/SubComponents/UrlPreviewMessage";
import MediaMessage from "../Message/SubComponents/MediaMessage";
import {
  containsVenmo,
  extractVenmoAmount,
  getVenmoHandle,
} from "../../managers/VenmoManager";

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
  setMessageToReplyTo: React.Dispatch<
    React.SetStateAction<Message | undefined>
  >;
}

export default function AbsoluteBlurReactionView(
  props: AbsoluteBlueReactionViewProps
) {
  const { chatUser } = useAppContext();

  const {
    reactionMessageAndYCoordinate,
    setReactionMessageAndYCoordinate,
    setMessageToReplyTo,
  } = props;
  const { yCoordinate, message } = reactionMessageAndYCoordinate;

  const isMe = chatUser?.id === message.chatuserID;

  const venmoHandle = getVenmoHandle(chatUser ?? undefined);
  const containsVenmoKeyword = containsVenmo(message.messageBody ?? "");
  const venmoAmount = extractVenmoAmount(message.messageBody ?? "");

  const isValidVenmoRequest =
    containsVenmoKeyword &&
    venmoAmount !== undefined &&
    venmoHandle !== undefined &&
    !isMe;

  const containsMoreThanUrl =
    (message.messageBody?.split(" ").length ?? 2) >= 2;

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
            marginLeft: isMe ? 0 : 35,
            maxWidth: "75%",
            alignSelf: isMe ? "flex-end" : "flex-start",
            alignItems: isMe ? "flex-end" : "flex-start",
          }}
        >
          <View style={{}}>
            <Pressable>
              <MessageReactMenu
                isMe={true}
                visible={true}
                message={message}
                onReplyToMessage={() => setMessageToReplyTo(message)}
                onReaction={() => setReactionMessageAndYCoordinate(undefined)}
                style={{ alignSelf: isMe ? "flex-start" : "flex-end" }}
              />
            </Pressable>
            <View
              style={{
                marginBottom: yCoordinate,
              }}
            >
              {message.replyToMessageID && (
                <ResponseMessage message={message} isMe={isMe} />
              )}
              {message.urlPreviewTitle && (
                <UrlPreviewMessage
                  message={message}
                  isMe={isMe}
                  containsMoreThanUrl={containsMoreThanUrl}
                />
              )}
              {message.messageBody &&
                (!message.urlPreviewTitle || containsMoreThanUrl) &&
                !message.replyToMessageID && (
                  <MessageBubble
                    message={message}
                    isValidVenmoRequest={isValidVenmoRequest}
                  />
                )}
              {message.imageUrl && <MediaMessage message={message} />}
            </View>
          </View>
        </View>
      </Pressable>
    </BlurView>
  );
}
