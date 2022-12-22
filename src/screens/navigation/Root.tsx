import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { enableScreens } from "react-native-screens";
import Comparison from "screens/Comparison";
import Home from "screens/Home";
import { RootParamList } from "screens/navigation/types";
import Photo from "screens/Photo";
import PhotoAndComparison from "screens/PhotoAndComparison";

enableScreens();

const Root = createBottomTabNavigator<RootParamList>();
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Root.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}
    >
      <Root.Screen
        name="Home"
        component={Home}
        options={() => ({
          tabBarVisible: true,
          tabBarIcon: () => (
            <Ionicons
              name="home"
              // color={color}
              size={20}
            />
          ),
        })}
      />
      <Root.Screen
        name="Photo"
        component={Photo}
        options={() => ({
          tabBarVisible: true,
          tabBarIcon: () => (
            <Ionicons
              name="camera"
              // color={color}
              size={20}
            />
          ),
        })}
      />
      <Root.Screen
        name="Comparison"
        component={Comparison}
        options={() => ({
          tabBarVisible: true,
          tabBarIcon: () => (
            <Ionicons
              name="images"
              // color={color}
              size={20}
            />
          ),
        })}
      />
    </Root.Navigator>
  );
}

export default function Navigation(): JSX.Element {
  return (
    <NavigationContainer<RootParamList>>
      <Stack.Navigator initialRouteName="MyStack">
        <Stack.Screen
          name="MyStack"
          component={MyStack}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PhotoAndComparison"
          component={PhotoAndComparison}
          options={{ title: "Compared Photo" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
