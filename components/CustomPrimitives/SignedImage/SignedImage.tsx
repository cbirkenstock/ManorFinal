import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageProps,
  ImageStyle,
  StyleProp,
  View,
} from "react-native";
import { fetchSignedUrl } from "../../../managers/MediaManager";
import { animate } from "../../../managers/AnimationManager";

interface SignedImageProps extends Omit<ImageProps, "source" | "style"> {
  source?: string | null;
  style?: StyleProp<ImageStyle>;
  duration?: number;
  opacityAnim?: Animated.Value;
}

export default function SignedImage(props: SignedImageProps) {
  const {
    source,
    style,
    duration = 200,
    opacityAnim = useRef(new Animated.Value(0)).current,
    ...rest
  } = props;
  const [signedUrl, setSignedUrl] = useState<string>("");

  /* -------------------------------------------------------------------------- */
  /*                               Fetch SignedUrl                              */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      {signedUrl ? (
        <Animated.Image
          source={{ uri: signedUrl }}
          onLoad={() => animate(opacityAnim, 1, duration)}
          style={[{ opacity: opacityAnim }, style]}
          {...rest}
        />
      ) : (
        <View style={style} />
      )}
    </>
  );
}
