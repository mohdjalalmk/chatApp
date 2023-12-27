import { View, Text, StyleSheet } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Amplify, Auth, graphqlOperation, API } from "aws-amplify";
import { useState, useEffect } from "react";
dayjs.extend(relativeTime);

const Message = ({ message }) => {
  // console.log("message:", message);
  const [isMe, setIsMe] = useState(false);

  useEffect(() => {
    isMyMessage();
  }, []);
  const isMyMessage = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    setIsMe(message?.userID == authUser.attributes.sub);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isMe ? "#DCF8C5" : "white",
          alignSelf: isMe ? "flex-end" : "flex-start",
        },
      ]}
    >
      <Text>{message.text}</Text>
      <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
    backgroundColor: "red",

    // Shadows
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  message: {},
  time: {
    alignSelf: "flex-end",
    color: "grey",
  },
});

export default Message;
