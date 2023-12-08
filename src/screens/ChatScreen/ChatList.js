import ChatListItem from "../../components/ChatListItem";
import { FlatList } from "react-native";
import chats from "../../../assets/data/chats.json";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { listChatRooms } from "./queries";
import { useEffect, useState } from "react";

const ChatList = () => {
  const [chatRomms, setChatRooms] = useState([]);
  useEffect(() => {
    const fetchChatRomms = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        console.log("authUser:", authUser);
        const response = await API.graphql(
          graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
        );
        console.log("og respp", response);
      } catch (error) {
        console.log(
          "error:",
          JSON.stringify(error?.data?.getUser?.ChatRooms?.items)
        );
        const data = error?.data?.getUser?.ChatRooms?.items?.filter(
          (item) => item !== null
        );
        console.log("data:",data)
        const sortedRooms = data.sort(
          (r1, r2) => {
           new Date(r2.chatRoom.updatedAt) - new Date(r1.chatRoom.updatedAt);
        });
        const sortedChatRooms = data.sort((a, b) => new Date(b.chatRoom.updatedAt) - new Date(a.chatRoom.updatedAt));

        setChatRooms(sortedChatRooms);
      }
    };

    fetchChatRomms();
  }, []);
  return (
    <FlatList
      data={chatRomms}
      renderItem={({ item }) => <ChatListItem chat={item} />}
    />
  );
};

export default ChatList;
