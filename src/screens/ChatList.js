import ChatListItem from "../components/ChatListItem";
import { FlatList } from "react-native";
import chats from "../../assets/data/chats.json";

const ChatList = () => {
    return (
        <FlatList
          data={chats}
          renderItem={({ item }) => <ChatListItem chat={item} />}
        />
      );};

export default ChatList;