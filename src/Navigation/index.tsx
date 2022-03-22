import React from "react";
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "@/containers/Home";
import SearchScreen from "@/containers/Search";
import LikesScreen from "@/containers/Likes";
import ProfileScreen from "@/containers/Profile";
import Colors from "@/utils/Colors";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

enum Routes {
  Home = "Home",
  Search = "Search",
  Likes = "Likes",
  Profile = "Profile",
}

export default function Navigation() {
  const tabBarIcon = ({
    route,
    focused,
    color,
    size,
  }: {
    route: RouteProp<ParamListBase, string>;
    focused: boolean;
    color: string;
    size: number;
  }) => {
    const props = { size, color };

    if (route.name === Routes.Home) {
      return <Ionicons name={"home-outline"} {...props} />;
    } else if (route.name === Routes.Search) {
      return <Ionicons name={"search"} {...props} />;
    } else if (route.name === Routes.Likes) {
      return <Ionicons name={"heart"} {...props} />;
    } else if (route.name === Routes.Profile) {
      return <Ionicons name={"person-outline"} {...props} />;
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarShowLabel: false,
            tabBarIcon: (props) => tabBarIcon({ ...props, route }),
            tabBarActiveTintColor: Colors.green,
            headerShown: false,
          })}
        >
          <Tab.Screen name={Routes.Home} component={HomeScreen} />
          <Tab.Screen name={Routes.Search} component={SearchScreen} />
          <Tab.Screen name={Routes.Likes} component={LikesScreen} />
          <Tab.Screen name={Routes.Profile} component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
