import React, { useEffect, useRef, useState } from "react";
import { Animated, Linking, View } from "react-native";
import useAppContext from "../../../hooks/useAppContext";
import { Message, Reaction } from "../../../src/models";
import { styles } from "./styles";
import ContactImage from "../SubComponents/ContactImage";
import ContactNameLabel from "../SubComponents/ContactNameLabel";
import MediaMessage from "../SubComponents/MediaMessage";
import MessageBubble from "../SubComponents/MessageBubble";
import MessageReactMenu from "../../MessageReactMenu/MessageReactMenu";
import { DataStore } from "aws-amplify";
import Colors from "../../../constants/Colors";
import IconCounter from "../SubComponents/IconCounter/IconCounter";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import MultiGestureButton from "../../CustomPrimitives/MultiGestureButton";
import { animate } from "../../../managers/AnimationManager";
import * as FileSystem from "expo-file-system";
import ReplyButton from "../SubComponents/ReplyButton/ReplyButton";
import UrlPreviewMessage from "../SubComponents/UrlPreviewMessage";

interface FullMessageComponentProps {
  message: Message;
  setZoomImage: React.Dispatch<
    React.SetStateAction<
      {
        uri: string;
      }[]
    >
  >;
  setMessageToReplyTo: React.Dispatch<
    React.SetStateAction<Message | undefined>
  >;
}

export default function FullMessageComponent(props: FullMessageComponentProps) {
  const { message, setZoomImage, setMessageToReplyTo } = props;
  const { chatUser, members } = useAppContext();

  const isMe = message.chatuserID === chatUser?.id;
  const sender = members.find((member) => member.id === message.chatuserID);
  const isFirstOfGroup = message.marginTop === 10;

  const heightAnim = useRef(new Animated.Value(0)).current;

  const isLocal = message.imageUrl?.includes("file:///");
  const isImage = message.imageUrl?.split(".")[1] === "jpg";

  /* ----------------------- General Reaction Constants ----------------------- */

  enum ReactionType {
    liked = "liked",
    disliked = "disliked",
  }

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const originalReactionRef = useRef<Reaction | undefined>();
  const reactionRef = useRef<Reaction | undefined>();
  const hasSetReactionRef = useRef<boolean>(false);

  /* ----------------------------- Likes Constants ---------------------------- */

  const [messageLikes, setMessageLikes] = useState<number | undefined>(
    message.likes ?? undefined
  );
  const messageLikesRef = useRef<number | undefined>(
    message.likes ?? undefined
  );

  useEffect(() => {
    setMessageLikes(message.likes ?? undefined);
  }, [message]);

  /* --------------------------- Dislikes Constants --------------------------- */

  const [messageDislikes, setMessageDislikes] = useState<number | undefined>(
    message.dislikes ?? undefined
  );
  const messageDislikesRef = useRef<number | undefined>(
    message.dislikes ?? undefined
  );

  useEffect(() => {
    setMessageDislikes(message.dislikes ?? undefined);
  }, [message]);

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

      originalReactionRef.current = reaction;
      reactionRef.current = reaction;
      hasSetReactionRef.current = true;
    };

    fetchReaction();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                             Increment/Decrement                            */
  /* -------------------------------------------------------------------------- */

  const incrementLikes = () => {
    const newMessageLikes = (messageLikes ?? 0) + 1;
    setMessageLikes(newMessageLikes);
    messageLikesRef.current = newMessageLikes;
  };

  const decrementLikes = () => {
    const newMessageLikes = (messageLikes ?? 1) - 1;
    setMessageLikes(newMessageLikes);
    messageLikesRef.current = newMessageLikes;
  };

  const incrementDislikes = () => {
    const newMessageDislikes = (messageDislikes ?? 0) + 1;
    setMessageDislikes(newMessageDislikes);
    messageDislikesRef.current = newMessageDislikes;
  };

  const decrementDislikes = () => {
    const newMessageDislikes = (messageDislikes ?? 1) - 1;
    setMessageDislikes(newMessageDislikes);
    messageDislikesRef.current = newMessageDislikes;
  };

  /* -------------------------------------------------------------------------- */
  /*                           Local Reaction Handler                           */
  /* -------------------------------------------------------------------------- */
  const reactToMessage = (reactionType: ReactionType) => {
    if (hasSetReactionRef.current === true) {
      const reaction = reactionRef.current;

      if (reaction) {
        if (reactionType === reaction.reactionType) {
          if (reactionType === ReactionType.liked) {
            decrementLikes();
          } else {
            decrementDislikes();
          }
          reactionRef.current = undefined;
        } else {
          if (reactionType === ReactionType.liked) {
            incrementLikes();
            decrementDislikes();

            reactionRef.current = {
              ...reactionRef.current,
              reactionType: ReactionType.liked,
            } as Reaction;
          } else {
            incrementDislikes();
            decrementLikes();

            reactionRef.current = {
              ...reactionRef.current,
              reactionType: ReactionType.disliked,
            } as Reaction;
          }
        }
      } else {
        if (chatUser) {
          if (reactionType === ReactionType.liked) {
            const newMessageLikes = (messageLikes ?? 0) + 1;
            setMessageLikes(newMessageLikes);
            messageLikesRef.current = newMessageLikes;
            reactionRef.current = new Reaction({
              chatUser: chatUser,
              chatUserID: chatUser?.id,
              message: message,
              messageID: message.id,
              reactionType: ReactionType.liked,
            });
          } else {
            const newMessageDislikes = (messageDislikes ?? 0) + 1;
            setMessageDislikes(newMessageDislikes);
            messageDislikesRef.current = newMessageDislikes;
            reactionRef.current = new Reaction({
              chatUser: chatUser,
              chatUserID: chatUser?.id,
              message: message,
              messageID: message.id,
              reactionType: ReactionType.disliked,
            });
          }
        }
      }

      setIsVisible(!isVisible);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                      Network Message Reaction Handler                      */
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Helpers -------------------------------- */

  const updateMessageReactions = (message: Message) => {
    DataStore.save(
      Message.copyOf(message, (updatedMessage) => {
        updatedMessage.likes = messageLikesRef.current;
        updatedMessage.dislikes = messageDislikesRef.current;
      })
    );
  };

  const updateReaction = (
    originalReaction: Reaction,
    currentReaction: Reaction
  ) => {
    DataStore.save(
      Reaction.copyOf(originalReaction, (updatedReaction) => {
        updatedReaction.reactionType = currentReaction.reactionType;
      })
    );
  };

  /* ---------------------------- Clean Up Function --------------------------- */

  useEffect(() => {
    const updateMessageAndReaction = () => {
      const originalReaction = originalReactionRef.current;
      const currentReaction = reactionRef.current;

      if (originalReaction?.reactionType === currentReaction?.reactionType) {
        return;
      }

      DataStore.query(Message, message.id).then((upToDateMessage) => {
        if (upToDateMessage) {
          try {
            updateMessageReactions(upToDateMessage);

            if (originalReaction && currentReaction) {
              updateReaction(originalReaction, currentReaction);
            } else if (!originalReaction && currentReaction) {
              DataStore.save(currentReaction);
            } else if (originalReaction && !currentReaction) {
              DataStore.delete(originalReaction);
            }
          } catch (error) {}
        }
      });
    };

    return () => updateMessageAndReaction();
  }, []);

  useEffect(() => {
    animate(heightAnim, 1, 300);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                 Zoom Image                                 */
  /* -------------------------------------------------------------------------- */

  const getImageCachePath = async () => {
    if (isImage) {
      try {
        if (isLocal) {
          setZoomImage([{ uri: message.imageUrl! }]);
        } else {
          const cachePath = `${FileSystem.cacheDirectory}.${message.imageUrl!}`;
          const imageInfo = await FileSystem.getInfoAsync(cachePath);

          if (imageInfo.exists) {
            setZoomImage([{ uri: cachePath }]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  const getMarginTop = () => {
    const marginTop = message.marginTop ?? 1;
    if (marginTop === 10) {
      return marginTop;
    } else {
      if (message?.likes ?? 0 >= 1) {
        return marginTop + 3;
      } else {
        return marginTop;
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: isMe ? "flex-end" : "flex-start",
          marginTop: getMarginTop(),
        },
      ]}
    >
      {!isMe && (
        <View
          style={[
            styles.contactImageContainer,
            { marginBottom: messageLikes ? 35 : 5 },
          ]}
        >
          {isFirstOfGroup && (
            <ContactImage profileImageUrl={sender?.profileImageUrl} />
          )}
        </View>
      )}
      <View style={{ maxWidth: "68%" }}>
        {!isMe && isFirstOfGroup && !isVisible && (
          <ContactNameLabel contactName={sender?.nickname} />
        )}
        <MessageReactMenu
          isMe={isMe}
          visible={isVisible}
          onLikeMessage={() => reactToMessage(ReactionType.liked)}
          onDislikeMessage={() => reactToMessage(ReactionType.disliked)}
        />
        <View
          style={{
            alignSelf: isMe ? "flex-end" : "flex-start",
          }}
        >
          <MultiGestureButton
            onPress={() => {
              if (message.imageUrl) {
                getImageCachePath();
              } else if (message.urlPreviewWebsiteUrl) {
                Linking.openURL(message.urlPreviewWebsiteUrl);
              }
            }}
            style={(message.likes ?? 0) >= 1 && styles.popularMessage}
            onDoublePress={() => setIsVisible(!isVisible)}
          >
            {message.urlPreviewTitle && <UrlPreviewMessage message={message} />}
            {message.messageBody && !message.urlPreviewTitle && (
              <MessageBubble message={message} />
            )}
            {message.imageUrl && <MediaMessage message={message} />}
          </MultiGestureButton>
          <View
            style={{
              flexDirection: "row",
              justifyContent: isMe ? "flex-start" : "flex-end",
              marginLeft: isMe ? -10 : 0,
              marginRight: isMe ? 0 : -10,
            }}
          >
            {messageLikes ? (
              <View
                style={[
                  styles.iconCounterContainer,
                  {
                    backgroundColor:
                      (message?.likes ?? 0) >= 1
                        ? Colors.manorGold
                        : isMe
                        ? Colors.manorPurple
                        : Colors.manorBlueGray,
                    marginRight: messageDislikes ? 5 : 0,
                  },
                ]}
              >
                <IconCounter
                  count={messageLikes}
                  side={"left"}
                  icon={
                    <FontAwesome
                      name="heart"
                      size={20}
                      color="white"
                      style={{ marginTop: 3 }}
                    />
                  }
                />
              </View>
            ) : null}
            {messageDislikes ? (
              <View
                style={[
                  styles.iconCounterContainer,
                  {
                    backgroundColor:
                      (message?.likes ?? 0) > 1
                        ? Colors.manorGold
                        : isMe
                        ? Colors.manorPurple
                        : Colors.manorBlueGray,
                  },
                ]}
              >
                <IconCounter
                  count={messageDislikes}
                  side={"left"}
                  icon={
                    <FontAwesome5
                      name="poop"
                      size={20}
                      color="white"
                      style={{ marginTop: 3 }}
                    />
                  }
                />
              </View>
            ) : null}
          </View>
        </View>
        <ReplyButton
          isMe={isMe}
          visible={isVisible}
          onPress={() => {
            setMessageToReplyTo(message);
            setIsVisible(false);
          }}
        />
      </View>
    </View>
  );
}

const areEqual = (prevMessage: any, nextMessage: any) => {
  return prevMessage["Message"]?.id === nextMessage["Message"]?.id;
};

export const MemoizedFullMessageComponent = React.memo(
  FullMessageComponent,
  areEqual
);
