import React from "react";
import { registerRootComponent } from "expo";
import Navigation from "@/navigation/index";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

function App() {
  return (
    <View style={{ flex: 1 }}>
      <Navigation />
      <StatusBar style="dark" />
    </View>
  );
}

export default registerRootComponent(App);
