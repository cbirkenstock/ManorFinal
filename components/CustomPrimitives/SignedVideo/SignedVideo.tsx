import { Video } from "expo-av";
import React, { useEffect, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { fetchSignedUrl } from "../../../managers/MediaManager";

interface SignedVideoProps {
  source?: string | null;
  style?: StyleProp<ViewStyle>;
}

export default function SignedVideo(props: SignedVideoProps) {
  const { source, style } = props;

  const [signedUrl, setSignedUrl] = useState<string>("");

  useEffect(() => {
    let unmounted = false;

    if (source) {
      fetchSignedUrl(source).then((_signedUrl) => {
        !unmounted && setSignedUrl(_signedUrl);
      });
    }

    return () => {
      unmounted = true;
    };
  }, [source]);

  return <Video style={style} source={{ uri: signedUrl }} useNativeControls />;
}
