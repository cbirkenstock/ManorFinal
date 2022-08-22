import React, { useRef, useState } from "react";
import { StyleSheet, View, TextInput, SafeAreaView, Alert } from "react-native";
import TriButton from "../../components/TriButton";
import Colors from "../../constants/Colors";
import useAuth from "../../hooks/useAuthContext";
import { ConfirmCodeScreenProps as Props } from "../../navigation/NavTypes";

export default function SignupScreen({ route, navigation }: Props) {
  const { confirmSignUp, signIn } = useAuth();

  const [isSigningIn, setIsSigningIn] = useState<boolean>(Boolean);

  let code = useRef<string>();

  const phone = route.params?.phone;
  const password = route.params?.password;
  const userName = route.params?.name;

  const openHomePage = async () => {
    if (phone && code && password) {
      setIsSigningIn(true);
      const confirmResult = await confirmSignUp(phone, code.current ?? "");

      if (confirmResult === "SUCCESS") {
        const signInResult = await signIn(phone, password, userName);

        if (signInResult !== "SUCCESS") {
          setIsSigningIn(false);

          Alert.alert(signInResult);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.input}
          keyboardAppearance="dark"
          placeholder="Confirmation Code..."
          placeholderTextColor="#E1D9D1"
          onChangeText={(value) => {
            code.current = value;
          }}
          value={code?.current}
        />

        <TriButton
          containerStyle={styles.triButtonContainer}
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

const styles = StyleSheet.create({
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
    paddingHorizontal: "5%",
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

  triButtonContainer: {
    width: "90%",
    marginTop: 60,
  },
});
