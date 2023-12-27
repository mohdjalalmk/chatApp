import { Text, Image, StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Amplify, Auth, graphqlOperation, API } from "aws-amplify";
import {
  createChatRoom,
  createUserChatRoom,
} from "../../../src/graphql/mutations";
import { getCommonChatRoomWithUser } from "../../services/chatRoomServices";
dayjs.extend(relativeTime);

const ContactListItem = ({ user }) => {
  // console.log("usesr::", user);
  const navigation = useNavigation();
  const onPressContact = async () => {
    // console.warn("pressed");
    //navigate to exsiting chatroom if any 
    const exsitingChatRoom = await getCommonChatRoomWithUser(user.id);
    if (exsitingChatRoom) {
      return navigation.navigate("Chat", { id: exsitingChatRoom.id });
    }

    //create a chat room
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, { input: {} })
    );
    const newChatRoom = newChatRoomData.data.createChatRoom;
    // console.log("newChatRoom:", newChatRoom);

    if(!newChatRoom){
      console.log('ERROR CREATING CHATROOM');
    }
    // add the clicked people to chat room
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: {chatRoomId: newChatRoom.id, userId: user.id },
      })
    );
    // add the current auth user to chat room
    const authUser = await Auth.currentAuthenticatedUser();
    // console.log("authUser",authUser);
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: {
          chatRoomId: newChatRoom.id,
          userId: authUser.attributes.sub,
        },
      })
    );
    navigation.navigate("Chat", { id: newChatRoom.id });
  };

  return (
    <Pressable onPress={onPressContact} style={styles.container}>
      <Image source={{ uri: user?.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {user?.name}
        </Text>

        <Text numberOfLines={2} style={styles.subTitle}>
          {user?.status}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
});

export default ContactListItem;
