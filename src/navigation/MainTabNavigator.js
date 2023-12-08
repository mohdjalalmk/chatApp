import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatList from "../screens/ChatScreen/ChatList";
import ChatsScreen from "../screens/ChatsScreen";
import NotImplementedScreens from "../screens/NotImplementedScreens";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import SettingsScreen from "../screens/SettingsScreen";
import { useNavigation, useRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const navigation = useNavigation();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Status"
        component={NotImplementedScreens}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="logo-whatsapp" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={NotImplementedScreens}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={NotImplementedScreens}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatList}
        screenOptions={{
          tabBarStyle: { backgroundColor: "whitesmoke" },
          headerStyle: { backgroundColor: "whitesmoke" },
        }}
        options={{
          headerRight: () => (
            <Entypo
              name="new-message"
              size={18}
              color={"royalblue"}
              style={{ marginRight: 15 }}
              onPress={()=>{navigation.navigate('Contact')}}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-chatbubbles-sharp" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
