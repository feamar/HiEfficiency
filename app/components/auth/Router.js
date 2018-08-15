/*import React from "react";
import { Platform, StatusBar } from "react-native";
import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createSwitchNavigator
} from "react-navigation";

import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Profile from "./screens/Profile";

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const SignedOut = createStackNavigator(
  {
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        title: "Sign Up",
        headerStyle
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        title: "Login",
        headerStyle
      }
    }
  },
  {
    initialRouteName: 'Login'
  }
);

export const SignedIn = createMaterialTopTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={30} color={tintColor} />
        )
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: "Profile",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="user" size={30} color={tintColor} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }
    }
  }
);

export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      SignedOut: {
        screen: SignedOut
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};*/