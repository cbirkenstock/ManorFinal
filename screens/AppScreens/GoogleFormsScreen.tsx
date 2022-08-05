import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/core";
import { WebView } from "react-native-webview";
import { GoogleFormsScreenProps } from "../../navigation/NavTypes";
import useAppContext from "../../hooks/useAppContext";
import {
  deletePendingAnnouncement,
  removeAnnouncement,
} from "../../managers/MessageManager";

export default function WebModalScreen({
  navigation,
  route,
}: GoogleFormsScreenProps) {
  const context = useAppContext();

  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const checkIfCompleted = (link: string) => {
    const linkArray = link.split("/");
    if (linkArray.includes("formResponse") && !isDeleted) {
      removeAnnouncement(context, route.params?.pendingAnnouncement);
      deletePendingAnnouncement(route.params?.pendingAnnouncement);
      setIsDeleted(true);
      navigation.goBack();
    }
  };

  return (
    <WebView
      style={styles.container}
      source={{ uri: route.params?.pendingAnnouncement.message.link! }}
      onNavigationStateChange={(state) => {
        checkIfCompleted(state.url);
      }}
    ></WebView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
