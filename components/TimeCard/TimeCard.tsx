import { useEffect, useRef } from "react";
import { View, Text, Animated, StyleProp, TextStyle } from "react-native";
import Colors from "../../constants/Colors";
import { animate } from "../../managers/AnimationManager";
import { formatTime } from "../../managers/DateTimeManager";

interface TimeCardProps {
  formattedDate?: string;
  date?: string;
  isVisible: boolean;
  style?: StyleProp<TextStyle>;
}

export default function TimeCard(props: TimeCardProps) {
  const { formattedDate, date, isVisible, style } = props;

  const heightAnim = useRef(new Animated.Value(formattedDate ? 20 : 0)).current;

  useEffect(() => {
    if (isVisible) {
      animate(heightAnim, 20, 200);
    } else {
      animate(heightAnim, 0, 200);
    }
  });

  return (
    <Animated.Text
      style={[
        {
          height: heightAnim,
          color: Colors.manorDarkWhite,
          fontWeight: "700",
          fontSize: 15,
          textAlign: "center",
        },
        style,
      ]}
    >
      {formattedDate ? formattedDate : date ? formatTime(new Date(date)) : null}
    </Animated.Text>
  );
}
