import React, { useEffect, useState } from "react";
import { Pressable, View, Image } from "react-native";
import { Message } from "../../../src/models";
import useAppContext from "../../../hooks/useAppContext";
import CacheImage from "../../CacheImage";
import { resizeImage } from "../../../managers/MediaManager";
import { styles } from "./styles";

interface MediaMessageProps {
  message: Message;
}

export default function MediaMessage(props: MediaMessageProps) {
  const { message } = props;
  const { chatUser } = useAppContext();
  const isMe = message.chatuserID === chatUser?.id;
  const isLocal = message.imageUrl?.includes("file:///");
  const [imageHeight, setImageHeight] = useState<number>();
  const [imageWidth, setImageWidth] = useState<number>();

  /* -------------------------------------------------------------------------- */
  /*                           Fetch Image Dimensions                           */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const { necessaryHeight, necessaryWidth } = resizeImage(message);

    setImageHeight(necessaryHeight);
    setImageWidth(necessaryWidth);
  }, [message]);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Pressable>
      <View
        style={[
          styles.imageBackground,
          isMe ? styles.imageOutgoing : styles.imageIncoming,
          {
            height: imageHeight,
            width: imageWidth,
            marginTop: message.marginTop,
          },
        ]}
      >
        {isLocal ? (
          <Image
            style={{ flex: 1 }}
            source={{
              uri: message.imageUrl!,
            }}
          />
        ) : (
          <CacheImage
            source={message.imageUrl!}
            cacheKey={message.id}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </Pressable>
  );
}
