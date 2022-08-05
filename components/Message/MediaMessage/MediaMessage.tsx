import React, { useEffect, useState } from "react";
import { Pressable, View, Image } from "react-native";
import { Message } from "../../../src/models";
import CacheImage from "../../CustomPrimitives/CacheImage";
import { resizeImage } from "../../../managers/MediaManager";
import { styles } from "./styles";
import * as FileSystem from "expo-file-system";

interface MediaMessageProps {
  message: Message;
  setZoomImage: React.Dispatch<
    React.SetStateAction<
      {
        uri: string;
      }[]
    >
  >;
}

export default function MediaMessage(props: MediaMessageProps) {
  const { message, setZoomImage } = props;
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

  const getImageCachePath = async () => {
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
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Pressable onPress={getImageCachePath}>
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
          <Image style={{ flex: 1 }} source={{ uri: message.imageUrl ?? "" }} />
        ) : (
          <CacheImage
            source={message.imageUrl!}
            cacheKey={message.imageUrl!}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </Pressable>
  );
}
