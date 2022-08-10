import React, { useState } from "react";
import { StyleSheet, View, TextInput, SafeAreaView, Alert } from "react-native";
import TriButton from "../../components/TriButton";
import Colors from "../../constants/Colors";
import useAuth from "../../hooks/useAuthContext";
import { ConfirmCodeScreenProps as Props } from "../../navigation/NavTypes";

export default function SignupScreen({ route, navigation }: Props) {
  const { confirmSignUp, signIn } = useAuth();

  const [code, setCode] = useState<string | null>();
  const [isSigningIn, setIsSigningIn] = useState<boolean>(Boolean);

  const phone = route.params?.phone;
  const password = route.params?.password;
  const userName = route.params?.name;
  const profileImageData = route.params?.profileImageData;

  const openHomePage = async () => {
    if (phone && code && password && profileImageData) {
      setIsSigningIn(true);
      const confirmResult = await confirmSignUp(phone, code);

      if (confirmResult === "SUCCESS") {
        const signInResult = await signIn(
          phone,
          password,
          userName,
          profileImageData
        );

        if (signInResult !== "SUCCESS") {
          setIsSigningIn(false);

          Alert.alert(signInResult);
        }
      }
    }
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <View style={loginStyles.buttonContainer}>
        <TextInput
          style={loginStyles.input}
          keyboardAppearance="dark"
          placeholder="Confirmation Code..."
          placeholderTextColor="#E1D9D1"
          onChangeText={(value) => {
            setCode(value);
          }}
          value={code?.toString()}
        />

        <TriButton
          mainButton={{ title: "Sign Up", onPress: openHomePage }}
          bottomLeftButton={{ title: "Forgot Password?", onPress: () => {} }}
          bottomRightButton={{
            title: "Log In",
            onPress: () => navigation.navigate("LoginScreen"),
          }}
          isLoading={isSigningIn}
        />
      </View>
    </SafeAreaView>
  );
}

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.manorBackgroundGray,
  },

  ManorView: {
    height: 75,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  text: {
    fontSize: 70,
    fontWeight: "600",
    color: "#5C6AEF",
  },

  buttonContainer: {
    marginTop: 30,
    paddingHorizontal: "7.5%",
  },

  input: {
    height: 60,
    borderWidth: 3,
    padding: 15,
    borderRadius: 40,
    borderColor: "#5C6AEF",
    color: "white",
    fontSize: 19,
  },
});
