import { API, graphqlOperation, Auth } from "aws-amplify";

export const getCommonChatRoomWithUser = async (userID) => {
  const authUser = await Auth.currentAuthenticatedUser();

  // get all chatRooms of user 1 ,
  try {
    const response = await API.graphql(
      graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
    );

    const chatRooms = response.data?.getUser?.ChatRooms?.items || [];

    const chatRoom = chatRooms.find((chatRoomItem) => {
      return (
        chatRoomItem.chatRoom.users.items.length === 2 &&
        chatRoomItem.chatRoom.users.items.some(
          (userItem) => userItem.user.id === userID
        )
      );
    });

    return chatRoom;
  } catch (error) {
    const chatRooms =
      error.data?.getUser?.ChatRooms?.items?.filter((item) => item != null) ||
      [];
    const chatRoom = chatRooms.find((chatRoomItem) => {
      return (
        chatRoomItem.chatRoom.users.items.length === 2 &&
        chatRoomItem.chatRoom.users.items.some(
          (userItem) => userItem.user.id === userID
        )
      );
    });
    // console.log("exisiting crooms:", chatRoom);

    return chatRoom;
  }
};

export const listChatRooms = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      ChatRooms {
        items {
          chatRoom {
            id
            users {
              items {
                user {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;
