import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useAuthContext } from "../../hooks/useAuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { LoginScreenProps as Props } from "../../navigation/NavTypes";
import TriButton from "../../components/TriButton";
import { DataStore } from "aws-amplify";
import { User } from "../../src/models";

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuthContext();
  const [phone, setPhone] = useState<string | null>();
  const [password, setPassword] = useState<string | null>();
  const [lastPhoneLength, setLastPhoneLength] = useState<Number>(0);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

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

  const _signIn = async () => {
    if (phone?.length !== 14) {
      Alert.alert("Please Input Correct Phone Number");
      return;
    }
    if (phone && password) {
      setIsSigningIn(true);
      const result = await signIn(phone!, password!);
      if (result !== "SUCCESS") {
        setIsSigningIn(false);
        Alert.alert(result);
      }
    }
  };

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
            onPress: _signIn,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 70,
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
});
