import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  Keyboard,
  Pressable,
} from "react-native";

import useAuth from "../../hooks/useAuthContext";
import usePhoneNumberFormatting from "../../hooks/usePhoneNumberFormatting";

import TriButton from "../../components/TriButton";

import Colors from "../../constants/Colors";
import { SignUpScreenProps as Props } from "../../navigation/NavTypes";

export default function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState<string>();

  let name = useRef<string>();
  let password = useRef<string>();

  /* -------------------------------------------------------------------------- */
  /*                          Go To Confirmation Screen                         */
  /* -------------------------------------------------------------------------- */

  const goToConfirmationScreen = async () => {
    if (name.current && phoneNumber && password.current) {
      signUp(name.current, phoneNumber, password.current);
      navigation.navigate("ConfirmCodeScreen", {
        name: name.current,
        phone: phoneNumber,
        password: password.current,
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.manorBackgroundGray,
      }}
    >
      <Pressable
        onPress={() => Keyboard.dismiss()}
        style={styles.paddingContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="First + Last Name..."
          placeholderTextColor="#E1D9D1"
          onChangeText={(value) => {
            name.current = value;
          }}
          value={name?.current?.toString()}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone..."
          placeholderTextColor="#E1D9D1"
          keyboardType="numeric"
          onChangeText={(value) => {
            setPhoneNumber(usePhoneNumberFormatting(value, phoneNumber ?? ""));
          }}
          value={phoneNumber?.toString()}
        />
        <TextInput
          style={styles.input}
          placeholder="Password..."
          secureTextEntry
          placeholderTextColor="#E1D9D1"
          onChangeText={(value) => {
            password.current = value;
          }}
          value={password?.current?.toString()}
        />
        <TriButton
          containerStyle={styles.triButtonContainer}
          mainButton={{
            title: "Sign Up",
            onPress: () => goToConfirmationScreen(),
          }}
          bottomLeftButton={{
            title: "Forgot Password?",
            onPress: () => {
              return null;
            },
          }}
          bottomRightButton={{
            title: "Log In",
            onPress: () => navigation.replace("LoginScreen"),
          }}
          isLoading={false}
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
    paddingVertical: "2%",
    paddingHorizontal: "5%",
  },

  input: {
    height: 60,
    paddingHorizontal: 15,
    borderWidth: 3,
    borderRadius: 40,
    borderColor: "#5C6AEF",
    color: "white",
    fontSize: 19,
    marginTop: 15,
  },

  triButtonContainer: { width: "90%", marginTop: 60 },
});
