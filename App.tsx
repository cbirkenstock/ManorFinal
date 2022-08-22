import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Amplify from "@aws-amplify/core";
import config from "./src/aws-exports.js";

import { AuthProvider } from "./navigation/Providers/AuthProvider";
import { Router } from "./navigation/Router";

import { DataStore } from "aws-amplify";
import { ExpoSQLiteAdapter } from "@aws-amplify/datastore-storage-adapter/ExpoSQLiteAdapter";

Amplify.configure(config);

DataStore.configure({
  storageAdapter: ExpoSQLiteAdapter,
});

// try {
//   const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

//   TaskManager.defineTask(
//     BACKGROUND_NOTIFICATION_TASK,
//     ({ data, error, executionInfo }) => {
//       DataStore.save(
//         new User({
//           cognitoUserSub: "1",
//           name: "This fucking worked????",
//           phoneNumber: "+17076852224",
//         })
//       );
//     }
//   );

//   Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

//   Alert.alert(
//     TaskManager.isTaskDefined(BACKGROUND_NOTIFICATION_TASK).toString()
//   );
// } catch (error) {}

function App() {
  // useEffect(() => {
  //   Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  // }, []);
  useEffect(() => {
    DataStore.start();
  }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Router />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

export default App;
