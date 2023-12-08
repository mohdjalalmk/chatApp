import { FlatList } from "react-native";
import chats from "../../assets/data/chats.json";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { useEffect, useState } from "react";

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((res) => {
      // console.log(res?.data?.listUsers);
      setUsers(res?.data?.listUsers.items);
    });
  }, []);
  console.log("users:", users);
  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <ContactListItem user={item} />}
      style={{ backgroundColor: "white" }}
    />
  );
};

export default ContactsScreen;
