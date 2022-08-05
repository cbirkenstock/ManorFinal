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
import { LoginScreenProps as Props } from "../../navigation/NavTypes";
import TriButton from "../../components/TriButton";
import { DataStore } from "aws-amplify";

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
    <SafeAreaView style={loginStyles.container}>
      <View style={loginStyles.ManorView}>
        <Text style={loginStyles.text}>Manor</Text>
      </View>
      <View style={{ paddingHorizontal: "7.5%" }}>
        <TextInput
          style={[loginStyles.input, { marginTop: 30 }]}
          keyboardAppearance="dark"
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
          keyboardAppearance="dark"
          placeholder="Password..."
          secureTextEntry
          placeholderTextColor="#E1D9D1"
          onChangeText={(value) => {
            setPassword(value);
          }}
          value={password?.toString()}
        />

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
            onPress: () => navigation.replace("SignUpScreen"),
          }}
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
    flex: 0.9,
    marginTop: 60,
    justifyContent: "space-between",
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
    borderWidth: 3,
    padding: 15,
    borderRadius: 40,
    borderColor: "#5C6AEF",
    color: "white",
    fontSize: 19,
    marginTop: 20,
  },
});
