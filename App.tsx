import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Amplify from "@aws-amplify/core";
import config from "./src/aws-exports.js";

import { AuthProvider } from "./navigation/Providers/AuthProvider";
import { Router } from "./navigation/Router";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { DataStore } from "aws-amplify";
import { User } from "./src/models/index.js";
import { Alert } from "react-native";

Amplify.configure(config);

// const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

// TaskManager.defineTask(
//   BACKGROUND_NOTIFICATION_TASK,
//   ({ data, error, executionInfo }) => {
//     DataStore.save(
//       new User({
//         cognitoUserSub: "1",
//         phoneNumber: "+17076852224",
//         name: "holy fucking shit",
//       })
//     );
//   }
// );

function App() {
  // useEffect(() => {
  //   Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  // }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Router />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

export default App;
