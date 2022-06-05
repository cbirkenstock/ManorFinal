import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { useAuthContext } from "../../hooks/useAuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { LoginScreenProps as Props } from "../../navigation/Types";
import TriButton from "../../components/TriButton";

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuthContext();
  const [phone, setPhone] = useState<string | null>();
  const [password, setPassword] = useState<string | null>();
  const [lastPhoneLength, setLastPhoneLength] = useState<Number>(0);

  useEffect(() => {
    if (phone) {
      if (phone.length > lastPhoneLength) {
        if (phone?.length === 3) {
          setPhone("(" + phone + ")" + " ");
        } else if (phone?.length === 9) {
          setPhone(phone + "-");
        }
      }
      setLastPhoneLength(phone.length);
    } else {
      setLastPhoneLength(0);
    }
  }, [phone]);

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior="padding"
      enabled
    >
      <SafeAreaView style={loginStyles.safeAreaView}>
        <View style={loginStyles.ManorView}>
          <Text style={loginStyles.text}>Manor</Text>
        </View>
        <View style={loginStyles.inputContainer}>
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <TextInput
              style={loginStyles.input}
              placeholder="Phone..."
              placeholderTextColor="#E1D9D1"
              keyboardType="numeric"
              onChangeText={(value) => {
                setPhone(value);
              }}
              value={phone?.toString()}
            />
            <TextInput
              style={loginStyles.input}
              placeholder="Password..."
              secureTextEntry
              placeholderTextColor="#E1D9D1"
              onChangeText={(value) => {
                setPassword(value);
              }}
              value={password?.toString()}
            />
          </View>
          <TriButton
            mainButton={{
              title: "Log In",
              onPress: () => signIn(phone!, password!),
            }}
            bottomLeftButton={{
              title: "Forgot Password?",
              onPress: () => {
                return null;
              },
            }}
            bottomRightButton={{
              title: "Sign Up",
              onPress: () => navigation.navigate("SignUpScreen"),
            }}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.manorBackgroundGray,
  },

  safeAreaView: {
    flex: 1,
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

  inputContainer: {
    flex: 0.8,
    marginTop: 60,
    justifyContent: "space-between",
    alignItems: "center",
  },

  button: {
    width: "75%",
    borderRadius: 20,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
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
    marginTop: 20,
  },
});
