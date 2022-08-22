import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { DataStore } from "aws-amplify";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleProp, View, ViewStyle } from "react-native";
import Colors from "../../constants/Colors";
import useAppContext from "../../hooks/useAppContext";
import { animate } from "../../managers/AnimationManager";
import { updateMessageLikes } from "../../managers/MessageManager";
import { Message, Reaction } from "../../src/models";
import IconButton from "../IconButton/IconButton";
import { ReactionType } from "../Message/FullMessageComponent/FullMessageComponent";
import { styles } from "./styles";

interface MessageReactMenuProps {
  isMe: boolean;
  visible: boolean;
  message: Message;
  onReaction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function MessageReactMenu(props: MessageReactMenuProps) {
  const { isMe, visible, message, onReaction, style } = props;
  const { messages, setMessages, chatUser } = useAppContext();

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

  /* ----------------------- General Reaction Constants ----------------------- */

  const [upToDateMessage, setUpToDateMessage] = useState<Message>();

  const hasLikedMessage =
    (upToDateMessage?.likes ?? 0) !== (message.likes ?? 0);
  const hasDislikedMessage =
    (upToDateMessage?.dislikes ?? 0) !== (message.dislikes ?? 0);

  const [originalReaction, setOriginalReaction] = useState<Reaction>();
  //const originalReactionRef = useRef<Reaction | undefined>();
  // const reactionRef = useRef<Reaction | undefined>();
  // const hasSetReactionRef = useRef<boolean>(false);

  /* ----------------------------- Likes Constants ---------------------------- */

  // const [messageLikes, setMessageLikes] = useState<number | undefined>(
  //   message.likes ?? undefined
  // );
  // const messageLikesRef = useRef<number | undefined>(
  //   message.likes ?? undefined
  // );

  // useEffect(() => {
  //   setMessageLikes(message.likes ?? undefined);
  // }, [message]);

  /* --------------------------- Dislikes Constants --------------------------- */

  // const [messageDislikes, setMessageDislikes] = useState<number | undefined>(
  //   message.dislikes ?? undefined
  // );
  // const messageDislikesRef = useRef<number | undefined>(
  //   message.dislikes ?? undefined
  // );

  // useEffect(() => {
  //   setMessageDislikes(message.dislikes ?? undefined);
  // }, [message]);

  /* -------------------------------------------------------------------------- */
  /*                               Fetch Reaction                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchReaction = async () => {
      const reaction = (
        await DataStore.query(Reaction, (reaction) =>
          reaction
            .chatUserID("eq", chatUser?.id ?? "")
            .messageID("eq", message.id)
        )
      )[0];

      setOriginalReaction(reaction);
      // originalReactionRef.current = reaction;
      // reactionRef.current = reaction;
      // hasSetReactionRef.current = true;
    };

    fetchReaction();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                             Increment/Decrement                            */
  /* -------------------------------------------------------------------------- */

  const createNewMessageSet = (newMessage: Message) => {
    const newMessages = messages.map((message) => {
      if (message.id === newMessage.id) {
        return newMessage;
      } else {
        return message;
      }
    });

    return newMessages;
  };

  const incrementLikes = () => {
    const newMessage = {
      ...message,
      likes: (message.likes ?? 0) + 1,
    } as Message;

    const newMessages = createNewMessageSet(newMessage);
    setMessages(newMessages);

    DataStore.query(Message, message.id).then((upToDateMessage) => {
      if (upToDateMessage) {
        DataStore.save(
          Message.copyOf(upToDateMessage, (updatedMessage) => {
            updatedMessage.likes = newMessage.likes;
          })
        );
      }
    });
  };

  const decrementLikes = () => {
    const newMessage = {
      ...message,
      likes: (message.likes ?? 1) - 1,
    } as Message;

    const newMessages = createNewMessageSet(newMessage);
    setMessages(newMessages);

    DataStore.query(Message, message.id).then((upToDateMessage) => {
      if (upToDateMessage) {
        DataStore.save(
          Message.copyOf(upToDateMessage, (updatedMessage) => {
            updatedMessage.likes = newMessage.likes;
          })
        );
      }
    });
  };

  const incrementDislikes = () => {
    const newMessage = {
      ...message,
      dislikes: (message.dislikes ?? 0) + 1,
    } as Message;

    const newMessages = createNewMessageSet(newMessage);
    setMessages(newMessages);

    DataStore.query(Message, message.id).then((upToDateMessage) => {
      if (upToDateMessage) {
        DataStore.save(
          Message.copyOf(upToDateMessage, (updatedMessage) => {
            updatedMessage.dislikes = newMessage.dislikes;
          })
        );
      }
    });
  };

  const decrementDislikes = () => {
    const newMessage = {
      ...message,
      dislikes: (message.dislikes ?? 1) - 1,
    } as Message;

    const newMessages = createNewMessageSet(newMessage);
    setMessages(newMessages);

    DataStore.query(Message, message.id).then((upToDateMessage) => {
      if (upToDateMessage) {
        DataStore.save(
          Message.copyOf(upToDateMessage, (updatedMessage) => {
            updatedMessage.dislikes = newMessage.dislikes;
          })
        );
      }
    });
  };

  const switchToLikes = () => {
    const newMessage = {
      ...message,
      dislikes: (message.dislikes ?? 1) - 1,
      likes: (message.likes ?? 0) + 1,
    } as Message;

    const newMessages = createNewMessageSet(newMessage);
    setMessages(newMessages);

    DataStore.query(Message, message.id).then((upToDateMessage) => {
      if (upToDateMessage) {
        DataStore.save(
          Message.copyOf(upToDateMessage, (updatedMessage) => {
            updatedMessage.dislikes = newMessage.dislikes;
            updatedMessage.likes = newMessage.likes;
          })
        );
      }
    });
  };

  const switchToDislikes = () => {
    const newMessage = {
      ...message,
      dislikes: (message.dislikes ?? 0) + 1,
      likes: (message.likes ?? 1) - 1,
    } as Message;

    const newMessages = createNewMessageSet(newMessage);
    setMessages(newMessages);

    DataStore.query(Message, message.id).then((upToDateMessage) => {
      if (upToDateMessage) {
        DataStore.save(
          Message.copyOf(upToDateMessage, (updatedMessage) => {
            updatedMessage.dislikes = newMessage.dislikes;
            updatedMessage.likes = newMessage.likes;
          })
        );
      }
    });
  };

  const updateReaction = (reactionType: ReactionType) => {
    if (originalReaction) {
      DataStore.save(
        Reaction.copyOf(originalReaction, (updatedReaction) => {
          updatedReaction.reactionType = reactionType;
        })
      );
    }
  };

  const createReaction = (reactionType: ReactionType) => {
    if (chatUser) {
      const reaction = new Reaction({
        chatUserID: chatUser?.id,
        chatUser: chatUser,
        messageID: message.id,
        message: message,
        reactionType: reactionType,
      });

      DataStore.save(reaction);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                           Local Reaction Handler                           */
  /* -------------------------------------------------------------------------- */
  const reactToMessage = (reactionType: ReactionType) => {
    if (originalReaction) {
      if (originalReaction.reactionType === ReactionType.liked) {
        if (reactionType === ReactionType.liked) {
          decrementLikes();
          DataStore.delete(originalReaction);
        } else {
          switchToDislikes();
          updateReaction(ReactionType.disliked);
        }
      } else {
        if (reactionType === ReactionType.disliked) {
          decrementDislikes();
          DataStore.delete(originalReaction);
        } else {
          switchToLikes();
          updateReaction(ReactionType.liked);
        }
      }
    } else {
      if (reactionType === ReactionType.liked) {
        incrementLikes();
        createReaction(ReactionType.liked);
      } else {
        incrementDislikes();
        createReaction(ReactionType.disliked);
      }
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          alignSelf: isMe ? "flex-start" : "flex-end",
          height: 50,
          transform: [{ scaleX: messageReactWidthScaleAnim }],
          marginVertical: visible ? 3 : 0,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.buttonRow,
          { transform: [{ scale: messageReactIconScaleAnim }] },
        ]}
      >
        <IconButton
          style={{ justifyContent: "center", alignItems: "center" }}
          icon={
            <FontAwesome name="heart" size={25} color={Colors.manorDarkWhite} />
          }
          color="transparent"
          padding={7}
          onPress={() => {
            reactToMessage(ReactionType.liked);
            //onReaction?.();
          }}
        />

        <IconButton
          icon={
            <FontAwesome5 name="poop" size={25} color={Colors.manorDarkWhite} />
          }
          padding={7}
          color="transparent"
          onPress={() => {
            reactToMessage(ReactionType.disliked);
            onReaction?.();
          }}
        />
        <View
          style={{
            width: 2,
            height: 40,
            backgroundColor: "white",
            marginHorizontal: 5,
          }}
        ></View>
        <IconButton
          icon={
            <MaterialCommunityIcons
              name="reply-circle"
              size={35}
              color={Colors.manorPaymentBlue}
            />
          }
          color="transparent"
          padding={0}
          onPress={() => {
            onReaction?.();
          }}
        />
      </Animated.View>
    </Animated.View>
  );
}
