import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Pressable,
  Keyboard,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import usePhoneNumberFormatting from "../../hooks/usePhoneNumberFormatting";

import TriButton from "../../components/TriButton";

import { LoginScreenProps as Props } from "../../navigation/NavTypes";
import Colors from "../../constants/Colors";
import useAuthContext from "../../hooks/useAuthContext";

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuthContext();

  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>();

  let password = useRef<string>().current;

  /* -------------------------------------------------------------------------- */
  /*                               Sign In Handler                              */
  /* -------------------------------------------------------------------------- */

  const _signIn = async () => {
    if (phoneNumber?.length !== 14) {
      Alert.alert("Please Input Correct Phone Number");
      return;
    }

    if (phoneNumber && password) {
      setIsSigningIn(true);
      const result = await signIn(phoneNumber!, password!);
      if (result !== "SUCCESS") {
        setIsSigningIn(false);
        Alert.alert(result);
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => Keyboard.dismiss()}
        style={styles.paddingContainer}
      >
        <Text style={styles.title}>Manor</Text>
        <TextInput
          style={[styles.input]}
          placeholder="Phone..."
          placeholderTextColor="#E1D9D1"
          keyboardType="numeric"
          onChangeText={(value) => {
            setPhoneNumber(usePhoneNumberFormatting(value, phoneNumber ?? ""));
          }}
          value={phoneNumber}
        />
        <TextInput
          style={styles.input}
          keyboardAppearance="dark"
          placeholder="Password..."
          secureTextEntry
          placeholderTextColor="#E1D9D1"
          onChangeText={(value) => {
            password = value;
          }}
        />
        <TriButton
          containerStyle={styles.triButtonContainer}
          mainButton={{ title: "Log In", onPress: _signIn }}
          bottomLeftButton={{
            title: "Forgot Password?",
            onPress: () => {
              return null;
            },
          }}
          bottomRightButton={{
            title: "Sign Up",
            onPress: () => navigation.replace("SignUpScreen"),
          }}
          isLoading={isSigningIn}
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.manorBackgroundGray,
  },

  paddingContainer: {
    flex: 1,
    paddingTop: "2%",
    paddingHorizontal: "5%",
  },

  title: {
    fontSize: 70,
    textAlign: "center",
    fontWeight: "600",
    color: "#5C6AEF",
  },

  input: {
    height: 60,
    borderWidth: 3,
    padding: 15,
    borderRadius: 40,
    borderColor: "#5C6AEF",
    color: "white",
    fontSize: 19,
    marginTop: 20,
  },

  triButtonContainer: {
    width: "90%",
    marginTop: 60,
    borderRadius: 20,
    height: 60,
    backgroundColor: "#5C6AEF",
  },
});
