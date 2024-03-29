import React from "react";
import { Modal, Pressable, View, Text } from "react-native";
import { ModalProps } from "react-native";
import { styles } from "./styles";

interface DialogProps extends ModalProps {
  visible: boolean;
  width?: string | number;
  height?: string | number;
  marginTop?: string | number;
  title?: string;
  titleAlign?: "center" | "left";
  helperText?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function Dialog(props: DialogProps) {
  const {
    height,
    width = "70%",
    title,
    titleAlign = "left",
    helperText,
    children,
    visible,
    marginTop = "25%",
    onClose,
    ...rest
  } = props;
  return (
    <Modal animationType="slide" transparent={true} visible={visible} {...rest}>
      <Pressable
        style={styles.exitView}
        onPress={() => {
          onClose();
        }}
      >
        {/* second pressable to prevent upper one from triggering on click of view */}
        <Pressable>
          <View
            style={[
              styles.container,
              {
                width: width,
                height: height,
                marginTop: marginTop,
              },
            ]}
          >
            <Text style={[styles.title, { textAlign: titleAlign }]}>
              {title}
            </Text>
            {helperText && (
              <Text style={[styles.helperText, { textAlign: titleAlign }]}>
                {helperText}
              </Text>
            )}
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
