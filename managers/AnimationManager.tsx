import { Animated } from "react-native";

export const animate = (
  Anim: Animated.Value,
  toValue: number,
  duration: number,
  callback?: () => void
) => {
  Animated.timing(Anim, {
    toValue: toValue,
    duration: duration,
    useNativeDriver: false,
  }).start(callback);
};

export const animateTwoSequence = (
  Anim: Animated.Value,
  toValue: number,
  duration: number,
  Anim2: Animated.Value,
  toValue2: number,
  duration2: number
) => {
  Animated.sequence([
    Animated.timing(Anim, {
      toValue: toValue,
      duration: duration,
      useNativeDriver: false,
    }),
    Animated.timing(Anim2, {
      toValue: toValue2,
      duration: duration2,
      useNativeDriver: false,
    }),
  ]).start();
};
