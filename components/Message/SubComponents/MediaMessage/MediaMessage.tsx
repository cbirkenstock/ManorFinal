import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Message } from "../../../../src/models";
import CacheImage from "../../../CustomPrimitives/CacheImage";
import { resizeImage } from "../../../../managers/MediaManager";
import { styles } from "./styles";
import { Video } from "expo-av";
import SignedVideo from "../../../CustomPrimitives/SignedVideo/SignedVideo";

interface MediaMessageProps {
  message: Message;
}

export default function MediaMessage(props: MediaMessageProps) {
  const { message } = props;
  const isLocal = message.imageUrl?.includes("file:///");
  const isImage = message.imageUrl?.split(".")[1] === "jpg";
  const [imageHeight, setImageHeight] = useState<number>();
  const [imageWidth, setImageWidth] = useState<number>();

  /* -------------------------------------------------------------------------- */
  /*                           Fetch Image Dimensions                           */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const { necessaryHeight, necessaryWidth } = resizeImage(message, isImage);
    setImageHeight(necessaryHeight);
    setImageWidth(necessaryWidth);
  }, [message]);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View
      style={[
        styles.imageBackground,
        {
          height: imageHeight,
          width: imageWidth,
        },
      ]}
    >
      {isLocal ? (
        isImage ? (
          <Image style={{ flex: 1 }} source={{ uri: message.imageUrl ?? "" }} />
        ) : (
          <Video
            style={{ flex: 1 }}
            source={{ uri: message.imageUrl ?? "" }}
            useNativeControls
          />
        )
      ) : isImage ? (
        <CacheImage
          source={message.imageUrl!}
          cacheKey={message.imageUrl!}
          style={{ flex: 1 }}
        />
      ) : (
        <SignedVideo style={{ flex: 1 }} source={message.imageUrl ?? ""} />
      )}
    </View>
  );
}
