import { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Message from "../components/Message";
import InputBox from "../components/InputBox";

import bg from "../../assets/images/BG.png";
import messages from "../../assets/data/messages.json";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom,listMessagesByChatRoom } from "../graphql/queries";
const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [chatRoom, setChatRoom] = useState(null);
  const [messages,setMessages] = useState([])
  console.log("route:", route.params);
  const chatRoomId = route?.params?.id;

  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, [route.params.name]);

  useEffect(() => {
    getChatRoomMessages();
  }, [chatRoomId]);

  useEffect(() => {
    getMessagesByChatRoom();
  }, [chatRoomId]);

  const getChatRoomMessages = async () => {
    console.log("chatRoomId:",chatRoomId);
    API.graphql(graphqlOperation(getChatRoom, { id: chatRoomId })).then(
      (result) => {
        console.log(result.data);
        setChatRoom(result.data?.getChatRoom);
        // setMessages(result.data?.getChatRoom.Messages.items)
      }
    );
  };

  const getMessagesByChatRoom = async () => {
    console.log("chatRoomId:",chatRoomId);
    API.graphql(graphqlOperation(listMessagesByChatRoom, { chatroomID: chatRoomId,sortDirection:"DESC" })).then(
      (result) => {
        console.log("RESULT::",result.data.listMessagesByChatRoom);
        setMessages(result.data?.listMessagesByChatRoom.items)
      }
    );
  };
  
  console.log("CHHHHHATTROOOOMMMMMM:", chatRoom);


  // if (!chatRoom) {
  //   return <ActivityIndicator />;
  // }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90}
      style={styles.bg}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
          style={styles.list}
          inverted
        />
        <InputBox chatRoom={chatRoom} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
});

export default ChatScreen;
