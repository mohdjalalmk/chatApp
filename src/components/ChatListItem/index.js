import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useNavigation } from "@react-navigation/native";
import { getCommonChatRoomWithUser } from "../../services/chatRoomServices";
import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";

const ChatListItem = ({ chat }) => {
  console.log("kkkk", JSON.stringify(chat));
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  // const user = chat?.chatRoom?.users?.items[0]?.user;
  useEffect(() => {
    const fetchUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      // Loop through chat.users.items and find a user that is not us (Authenticated user)
      const userItem = chat.chatRoom.users.items.find(
        (item) => item.user.id !== authUser.attributes.sub
      );
      setUser(userItem?.user);
    };

    fetchUser();
  }, []);
  console.log("kkkkk", user);

  return (
    <Pressable
      onPress={async () => {
        console.warn("pressed");
        const ExistingchatRooms = await getCommonChatRoomWithUser(user?.id);
        console.log("ExistingchatRooms:", ExistingchatRooms);
        if (ExistingchatRooms) {
          navigation.navigate("Chat", { id: ExistingchatRooms.chatRoom?.id, name: user?.name });
          return;
        }
      }}
      style={styles.container}
    >
      {/* User Avatar */}
      <Image source={{ uri: user?.image }} style={styles.image} />

      {/* content */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {user?.name}
          </Text>

          <Text style={styles.subTitle}>
            {dayjs(chat?.chatRoom.LastMessage?.createdAt).fromNow()}{" "}
          </Text>
        </View>

        <Text style={styles.subTitle} numberOfLines={2}>
          {chat?.chatRoom.LastMessage?.text}
        </Text>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderBottomColor: "lightgray",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  name: {
    fontWeight: "bold",
    flex: 1,
  },
  subTitle: {
    color: "grey",
  },
});

export default ChatListItem;
