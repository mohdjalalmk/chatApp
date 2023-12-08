import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Navigator from "./src/navigation";
import { Amplify, Auth, graphqlOperation, API } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
import { useEffect } from "react";
import { getUser } from "./src/graphql/queries";
import { createUser } from "./src/graphql/mutations";

Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

function App() {
  useEffect(() => {
    const syncUser = async () => {
      // get the auth user
      try {
        const currentUser = await Auth.currentAuthenticatedUser({
          bypassCache: true,
        });
        console.log(currentUser);

        // get db user with auth user id (sub id)
        const userData = await API.graphql(
          graphqlOperation(getUser, { id: currentUser.attributes.sub })
        );
        console.log("userData:", userData);
        newUser = {
          id: currentUser.attributes.sub,
          name: currentUser.attributes.email,
          image: "",
          status: "Hey there",
        };
        if (!userData.data.getUser) {
          const newUserRes = await API.graphql(
            graphqlOperation(createUser, { input: newUser })
          );
          console.log("newUserRes:", newUserRes);
        } else {
          console.log("user exist");
        }
      } catch (error) {
        console.log("error in app:", error);
      }

      // update db if there is no user
    };
    syncUser();
  }, []);

  return (
    <View style={styles.container}>
      <Navigator />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    justifyContent: "center",
  },
});

export default withAuthenticator(App);
