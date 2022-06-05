import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import useAuth from "../../hooks/useAuthContext";
import { ConfirmCodeScreenProps as Props } from "../../navigation/Types";

export default function SignupScreen({ route, navigation }: Props) {
  const { confirmSignUp, signIn } = useAuth();

  const [phone, setPhone] = useState<string | null>(route.params?.phone);
  const [code, setCode] = useState<string | null>();
  const [password, setPassword] = useState<string | null>(
    route.params?.password
  );

  const openHomePage = async () => {
    if (phone && code && password) {
      confirmSignUp(phone, code);
      signIn(phone, password);
    }
  };

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior="padding"
      enabled
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={loginStyles.ManorView}>
          {/* <Image
            style={loginStyles.logo}
            source={{
              uri: "https://manorchatapptestingbucketpublic.s3.amazonaws.com/GradientManorLogo.png",
            }}
          /> */}
          <Text style={loginStyles.text}>Manor</Text>
        </View>
        <View style={loginStyles.buttonContainer}>
          <TextInput
            style={loginStyles.input}
            placeholder="Confirmation Code..."
            placeholderTextColor="#E1D9D1"
            onChangeText={(value) => {
              setCode(value);
            }}
            value={code?.toString()}
          />
        </View>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <TouchableOpacity style={loginStyles.button} onPress={openHomePage}>
            <Text style={loginStyles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "75%",
              marginTop: 10,
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity>
              <Text style={{ color: "#5C6AEF", fontSize: 15 }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={{ color: "#5C6AEF", fontSize: 15 }}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#242323",
    justifyContent: "flex-start",
  },

  ManorView: {
    height: 75,
    width: "100%",
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

  logo: {
    height: 75,
    width: 75,
    marginRight: 5,
    marginTop: 5,
  },

  buttonContainer: {
    height: "50%",
    marginTop: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  button: {
    width: "75%",
    borderRadius: 20,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5C6AEF",
  },

  buttonText: {
    fontSize: 27,
    color: "white",
  },

  input: {
    height: 60,
    width: "85%",
    borderWidth: 3,
    padding: 15,
    borderRadius: 40,
    borderColor: "#5C6AEF",
    color: "white",
    fontSize: 19,
  },
});
