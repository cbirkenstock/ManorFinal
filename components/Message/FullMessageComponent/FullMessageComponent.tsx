import React, { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import useAppContext from "../../../hooks/useAppContext";
import { Message, Reaction } from "../../../src/models";
import { styles } from "./styles";
import ContactImage from "../SubComponents/ContactImage";
import ContactNameLabel from "../SubComponents/ContactNameLabel";
import LikeIndicator from "../SubComponents/LikeIndicator/LikeIndicator";
import MediaMessage from "../SubComponents/MediaMessage";
import MessageBubble from "../SubComponents/MessageBubble";
import MessageReactMenu from "../../MessageReactMenu/MessageReactMenu";
import { DataStore } from "aws-amplify";
import { updateMessageLikes } from "../../../managers/MessageManager";

interface FullMessageComponentProps {
  message: Message;
  setZoomImage: React.Dispatch<
    React.SetStateAction<
      {
        uri: string;
      }[]
    >
  >;
}

export default function FullMessageComponent(props: FullMessageComponentProps) {
  const { message, setZoomImage } = props;
  const { chatUser, members } = useAppContext();

  const isMe = message.chatuserID === chatUser?.id;
  const sender = members.find((member) => member.id === message.chatuserID);
  const isFirstOfGroup = message.marginTop === 10;

  /* ----------------------- General Reaction Constants ----------------------- */

  enum ReactionType {
    liked = "liked",
    disliked = "disliked",
  }

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [hasReactedToMessage, setHasReactedToMessage] = useState<boolean>();

  const [reaction, setReaction] = useState<Reaction | undefined>();
  const reactionRef = useRef<Reaction | undefined>();

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

  const [hasDislikedMessage, setHasDislikedMessage] = useState<boolean>();

  const [messageDislikes, setMessagedisLikes] = useState<number | undefined>(
    message.dislikes ?? undefined
  );
  const messagedisLikesRef = useRef<number | undefined>(
    message.dislikes ?? undefined
  );

  /* -------------------------------------------------------------------------- */
  /*                               Fetch Reaction                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchReaction = async () => {
      const _reaction = (
        await DataStore.query(Reaction, (reaction) =>
          reaction
            .chatUserID("eq", chatUser?.id ?? "")
            .messageID("eq", message.id)
        )
      )[0];

      setHasReactedToMessage(Boolean(_reaction));
      setReaction(_reaction);
    };

    fetchReaction();
  }, []);

  useEffect(() => {
    reactionRef.current = reaction;
  }, [reaction]);

  /* -------------------------------------------------------------------------- */
  /*                                Like Message                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    messageLikesRef.current = messageLikes;
  }, [messageLikes]);

  //check what type of react -- if there's already reaction update it, if not create it, update message likes & dislikes appropriately

  useEffect(() => {
    const updateMessageLikeCount = () => {
      const _messageLikes = messageLikesRef.current;
      const _reaction = reactionRef.current;

      if (_messageLikes !== undefined && _messageLikes != message.likes) {
        if (chatUser && _messageLikes > (message.likes ?? 0)) {
          const newReaction = new Reaction({
            chatUser: chatUser,
            chatUserID: chatUser?.id,
            message: message,
            messageID: message.id,
            reactionType: ReactionType.liked,
          });

          DataStore.save(newReaction);
        } else if (_reaction && _messageLikes < (message.likes ?? 1)) {
          DataStore.delete(_reaction);
        }

        const newMessage = { ...message, likes: _messageLikes };
        updateMessageLikes(newMessage);
      }
    };

    return () => updateMessageLikeCount();
  }, []);

  const likeMessage = async () => {
    if (hasReactedToMessage !== undefined) {
      if (hasReactedToMessage) {
        setMessageLikes((messageLikes ?? 1) - 1);
      } else {
        setMessageLikes((messageLikes ?? 0) + 1);
      }

      setHasReactedToMessage(!hasReactedToMessage);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               Dislike Message                              */
  /* -------------------------------------------------------------------------- */

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: isMe ? "flex-end" : "flex-start",
          marginTop: message.marginTop ?? 1,
        },
      ]}
    >
      {/* This way even if no image, the spacing still there */}
      <View style={styles.senderImageContainer}>
        {!isMe && isFirstOfGroup && (
          <ContactImage profileImageUrl={sender?.profileImageUrl} />
        )}
      </View>
      <View style={{ maxWidth: message.messageBody ? "68%" : undefined }}>
        {!isMe && isFirstOfGroup && (
          <ContactNameLabel contactName={sender?.nickname} />
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {messageLikes && isMe ? (
            <LikeIndicator messageLikes={messageLikes} isMe={isMe} />
          ) : null}
          <Pressable onPress={() => setIsVisible(!isVisible)}>
            <MessageReactMenu
              isMe={isMe}
              visible={isVisible}
              onLikeMessage={() => likeMessage()}
              onReaction={() => setIsVisible(!isVisible)}
            />
            {message.messageBody && <MessageBubble message={message} />}
            {message.imageUrl && (
              <MediaMessage message={message} setZoomImage={setZoomImage} />
            )}
          </Pressable>
          {messageLikes && !isMe ? (
            <LikeIndicator messageLikes={messageLikes} isMe={isMe} />
          ) : null}
        </View>
      </View>
    </View>
  );
}
