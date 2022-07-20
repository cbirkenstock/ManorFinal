// import React from "react";
// import { Pressable, Text, TextInput } from "react-native";
// import Colors from "../../../../constants/Colors";
// import Dialog from "../../../Dialog/Dialog";

// export default function MessageAllForm() {
//   return (
//     <Dialog
//       visible={true}
//       width="70%"
//       title="Message All"
//       helperText="This message will be sent as a DM to everyone on this List"
//     >
//       <TextInput
//         style={{
//           height: 75,
//           padding: 5,
//           borderWidth: 2,
//           borderColor: Colors.manorPurple,
//           borderRadius: 10,
//           marginTop: 10,
//           color: "white",
//           fontSize: 15,
//         }}
//         autoFocus={true}
//         placeholder={"Message"}
//         placeholderTextColor={"#E1D9D1"}
//         // value={messageToAll ?? ""}
//         textAlign="left"
//         multiline={true}
//       />
//       <Pressable
//         style={{
//           marginTop: 10,
//           borderRadius: 20,
//           padding: 10,
//           elevation: 2,
//           backgroundColor: Colors.manorPurple,
//         }}
//       >
//         <Text
//           style={{
//             color: "white",
//             fontWeight: "bold",
//             textAlign: "center",
//           }}
//         >
//           Send Message
//         </Text>
//       </Pressable>
//     </Dialog>
//   );
// }
