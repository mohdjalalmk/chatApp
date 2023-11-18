import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChatsScreen from "../screens/ChatsScreen";
import ChatList from "../screens/ChatList";
import MainTabNavigator from "./MainTabNavigator";
import ContactsScreen from "../screens/ContactScreens";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Chats" component={ChatList} /> */}
        <Stack.Screen name="Chat" component={ChatsScreen} />
        <Stack.Screen name="Contact" component={ContactsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
