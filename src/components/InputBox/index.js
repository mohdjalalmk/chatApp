import { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import {
  createMessage,
  updateChatRoom,
  createAttachment,
} from "../../graphql/mutations";

const InputBox = ({ chatRoom }) => {
  const [newMessage, setNewMessage] = useState("");

  const onSend = async () => {
    console.warn("Sending a new message: ", chatRoom.id, newMessage);
    const authUser = await Auth.currentAuthenticatedUser();
    const message = {
      chatroomID: chatRoom.id,
      text: newMessage,
      userID: authUser.attributes.sub,
    };
    const newMessageResponse = await API.graphql(
      graphqlOperation(createMessage, { input: message })
    );
    // console.log("newMessageResponse:",newMessageResponse);

    // SET last msg in chatroom
    const response = await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          _version: chatRoom._version,
          chatRoomLastMessageId: newMessageResponse.data.createMessage.id,
          id:chatRoom.id
        },
      })
    );
    // console.log("last msg sent:::::", response);
    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      {/* Icon */}
      <AntDesign name="plus" size={20} color="royalblue" />

      {/* Text Input */}
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        placeholder="type your message..."
      />

      {/* Icon */}
      <MaterialIcons
        onPress={onSend}
        style={styles.send}
        name="send"
        size={16}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,

    borderRadius: 50,
    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden",
  },
});

export default InputBox;
