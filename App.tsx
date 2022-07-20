import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Amplify from "@aws-amplify/core";
import config from "./src/aws-exports.js";

import { AuthProvider } from "./navigation/Providers/AuthProvider";
import { Router } from "./navigation/Router";

Amplify.configure(config);

function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Router />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

export default App;
