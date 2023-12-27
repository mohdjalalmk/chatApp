import ChatListItem from "../../components/ChatListItem";
import { FlatList } from "react-native";
import chats from "../../../assets/data/chats.json";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { listChatRooms } from "./queries";
import { useEffect, useState } from "react";
import { onUpdateChatRoom } from "../../graphql/subscriptions";

const ChatList = () => {
  const [chatRomms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChatRomms();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chat.chatRoom.id } } })
    ).subscribe({
      next: ({ value }) => {
        console.log("hjvjvj",value);
        // setChatRoom((cr) => ({
        //   ...(cr || {}),
        //   ...value.data.onUpdateChatRoom,
        // }));
      },
      error: (err) => console.warn(err),
    });
console.log("subscribed");
    return () => subscription.unsubscribe();
  }, []);

  const fetchChatRomms = async () => {
    setLoading(true)
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      const response = await API.graphql(
        graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
      );
      // console.log("og respp", response);
    } catch (error) {
      console.log(
        "error:",
        JSON.stringify(error?.data?.getUser?.ChatRooms?.items)
      );
      const data = error?.data?.getUser?.ChatRooms?.items?.filter(
        (item) => item !== null
      );
      // const sortedRooms = data.sort(
      //   (r1, r2) => {
      //    new Date(r2.chatRoom.updatedAt) - new Date(r1.chatRoom.updatedAt);
      // });
      const sortedChatRooms = data?.sort(
        (a, b) =>
          new Date(b.chatRoom.updatedAt) - new Date(a.chatRoom.updatedAt)
      );

      setChatRooms(sortedChatRooms);
    }
    setLoading(false)
  };

  return (
    <FlatList
      data={chatRomms}
      renderItem={({ item }) => <ChatListItem chat={item} />}
      refreshing={loading}
      onRefresh={fetchChatRomms}
    />
  );
};

export default ChatList;
