import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, SafeAreaView } from "react-native";
import ToggleButton from "../../components/ToggleButton";
import TriButton from "../../components/TriButton";
import Colors from "../../constants/Colors";
import useAuth from "../../hooks/useAuthContext";
import { SignUpScreenProps as Props } from "../../navigation/NavTypes";
import { AntDesign } from "@expo/vector-icons";
import {
  fetchMediaBlob,
  PickImageRequestEnum,
  pickMedia,
} from "../../managers/MediaManager";
import { setProfileImage } from "../../managers/UserManager";
import { ImageInfo } from "expo-image-picker";

export default function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [name, setName] = useState<string | null>();
  const [phone, setPhone] = useState<string | null>();
  const [password, setPassword] = useState<string | null>();
  const [lastPhoneLength, setLastPhoneLength] = useState<Number>(0);
  const [profileImageData, setProfileImageData] = useState<{
    fullQualityImageMetaData: ImageInfo;
    type: "video" | "image";
    uri: string;
    width: number;
    height: number;
    base64?: string | undefined;
  } | null>();

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
    if (name && phone && password && profileImageData) {
      signUp(name, phone, password);
      navigation.navigate("ConfirmCodeScreen", {
        name: name,
        phone: phone,
        password: password,
        profileImageData: profileImageData,
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.manorBackgroundGray,
      }}
    >
      <View style={{ paddingHorizontal: "7.5%" }}>
        <TextInput
          style={[loginStyles.input, { marginTop: 40 }]}
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

        <ToggleButton
          text={profileImageData ? "Picure Added" : "Add Profile Picture"}
          startAdornment={
            !profileImageData && (
              <AntDesign name="plus" size={24} color="white" />
            )
          }
          toggleStyle={[
            loginStyles.input,
            { backgroundColor: "transparent", justifyContent: "flex-start" },
            {
              borderColor: profileImageData
                ? Colors.manorGreen
                : Colors.manorPurple,
            },
          ]}
          textStyle={{ color: "#E1D9D1", fontSize: 19 }}
          onPress={async () => {
            const imageData = await pickMedia(
              PickImageRequestEnum.setProfileImage
            );

            setProfileImageData(imageData);
          }}
        />

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
          isLoading={false}
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

  buttonContainer: {
    flex: 0.9,
    marginTop: 0,
    justifyContent: "space-between",
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
    paddingHorizontal: 15,
    borderWidth: 3,
    borderRadius: 40,
    borderColor: "#5C6AEF",
    color: "white",
    fontSize: 19,
    marginTop: 15,
  },
});
