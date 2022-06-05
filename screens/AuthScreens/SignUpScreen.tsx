import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import TriButton from "../../components/TriButton";
import useAuth from "../../hooks/useAuthContext";
import { SignUpScreenProps as Props } from "../../navigation/Types";

export default function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [name, setName] = useState<string | null>();
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

  const goToConfirmationScreen = async () => {
    if (name && phone && password) {
      signUp(name, phone, password);
      navigation.navigate("ConfirmCodeScreen", {
        phone: phone,
        password: password,
      });
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
            placeholder="First + Last Name..."
            placeholderTextColor="#E1D9D1"
            onChangeText={(value) => {
              setName(value);
            }}
            value={name?.toString()}
          />
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
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <TriButton
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
          />
          {/* <TouchableOpacity
            style={loginStyles.button}
            onPress={goToConfirmationScreen}
          >
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
            <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
              <Text style={{ color: "#5C6AEF", fontSize: 15 }}>Log In</Text>
            </TouchableOpacity>
          </View> */}
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
