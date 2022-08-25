import React, { useEffect, useRef, useState } from "react";
import { Message } from "../../src/models";
import { BlurView } from "expo-blur";
import { MemoizedFullMessageComponent } from "../Message/FullMessageComponent/FullMessageComponent";
import { DataStore, SortDirection } from "aws-amplify";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "./styles";
import { Animated, Pressable, View } from "react-native";
import { animate } from "../../managers/AnimationManager";

interface AbsoluteBlueReactionViewProps {
  messageToReplyTo: Message;
  setMessageToReplyTo: React.Dispatch<
    React.SetStateAction<Message | undefined>
  >;
  threadMessages?: Message[];
  setThreadMessages: React.Dispatch<
    React.SetStateAction<Message[] | undefined>
  >;
}

export default function AbsoluteBlurReactionView(
  props: AbsoluteBlueReactionViewProps
) {
  const {
    messageToReplyTo,
    setMessageToReplyTo,
    threadMessages,
    setThreadMessages,
  } = props;

  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animate(opacityAnim, 1, 200);
  }, [messageToReplyTo]);

  useEffect(() => {
    if (messageToReplyTo.replyToMessageID) {
      DataStore.query(
        Message,
        (message) =>
          message.or((message) =>
            message
              .id("eq", messageToReplyTo.replyToMessageID ?? "")
              .replyToMessageID("eq", messageToReplyTo.replyToMessageID ?? "")
          ),
        {
          sort: (message) => message.createdAt(SortDirection.DESCENDING),
        }
      ).then((_threadMessages) => {
        if (_threadMessages) {
          setThreadMessages(_threadMessages);
        }
      });
    } else {
      DataStore.query(
        Message,
        (message) =>
          message.or((message) =>
            message
              .id("eq", messageToReplyTo.id)
              .replyToMessageID("eq", messageToReplyTo.id ?? "")
          ),
        {
          sort: (message) => message.createdAt(SortDirection.DESCENDING),
        }
      ).then((_threadMessages) => {
        if (_threadMessages) {
          setThreadMessages(_threadMessages);
        }
      });
    }
  }, [messageToReplyTo]);

  const updateMessageMargin = (index: number) => {
    if (!threadMessages) return;

    if (index === threadMessages?.length - 1) {
      return 10;
    } else {
      if (
        threadMessages?.[index + 1].chatuserID ===
        threadMessages?.[index].chatuserID
      ) {
        return 1;
      } else {
        return 10;
      }
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const updatedMessage = {
      ...item,
      marginTop: updateMessageMargin(index),
    } as Message;

    return (
      <MemoizedFullMessageComponent
        style={{
          height:
            index === (threadMessages?.length ?? 1) - 1 ? 1000 : undefined,
          justifyContent: "flex-end",
        }}
        message={updatedMessage}
        isPartOfThread={true}
        onBackgroundPress={() => setMessageToReplyTo(undefined)}
      />
    );
  };

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <BlurView
        intensity={50}
        tint={"dark"}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <FlatList
          style={styles.threadMessageFlatlist}
          inverted
          initialNumToRender={20}
          keyboardDismissMode={"on-drag"}
          showsVerticalScrollIndicator={false}
          data={threadMessages}
          keyExtractor={(message) => message?.id}
          renderItem={renderMessage}
        />
      </BlurView>
    </Animated.View>
  );
}
