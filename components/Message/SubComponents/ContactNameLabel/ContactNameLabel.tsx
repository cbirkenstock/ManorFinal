import React from "react";
import { Text } from "react-native";
import { styles } from "./styles";

interface ContactNameLabelProps {
  contactName: string | null | undefined;
}
export default function contactImage(props: ContactNameLabelProps) {
  const { contactName } = props;
  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return <Text style={styles.nameLabelText}>{contactName}</Text>;
}
