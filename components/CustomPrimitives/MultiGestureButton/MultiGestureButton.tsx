import { useRef } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

interface MultiGestureButtonProps {
  onPress?: () => any;
  onDoublePress?: () => any;
  onLongPress?: () => any;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function MultiGestureButton(props: MultiGestureButtonProps) {
  const { onPress, onDoublePress, children, ...rest } = props;
  const lastPress = useRef<number>();
  const waiting = useRef<boolean>();

  const waitTime = 200;

  /* -------------------------------------------------------------------------- */
  /*                                Tap Listener                                */
  /* -------------------------------------------------------------------------- */

  /* ----------------------------- Single Tap Wait ---------------------------- */

  const startWait = (onEndFunction?: () => any) => {
    setTimeout(() => {
      if (waiting.current === true) {
        onEndFunction?.();
      }
      waiting.current = false;
    }, 200);
  };

  /* -------------------------------- Listener -------------------------------- */

  const checkIfDoubleOrSingleTap = () => {
    waiting.current = true;
    const currentTime = new Date().getTime();

    if (lastPress.current) {
      if (currentTime - lastPress.current < waitTime) {
        onDoublePress?.();
        waiting.current = false;
      } else {
        startWait(onPress);
      }
    } else {
      startWait(onPress);
    }
    lastPress.current = currentTime;
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        checkIfDoubleOrSingleTap();
      }}
      {...rest}
    >
      {children}
    </TouchableWithoutFeedback>
  );
}
