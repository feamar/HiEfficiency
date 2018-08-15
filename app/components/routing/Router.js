import React from 'react';
import 
{
    createStackNavigator,
    createMaterialTopTabNavigator,
    createSwitchNavigator
} from "react-navigation";
  
import { Platform, StatusBar } from "react-native";
import ScreenRegister from "../screens/ScreenRegister";
import ScreenLogin from "../screens/ScreenLogin";
import ScreenHome from "../screens/ScreenHome";
import ScreenProfile from "../screens/ScreenProfile";
import Theme from '../../styles/Theme';
  
export const STACK_NAME_AUTH = "Auth";
export const STACK_NAME_HOME = "Home";

export const SCREEN_NAME_AUTH_LOGIN = "Login";
export const SCREEN_NAME_AUTH_REGISTER = "Register";

export const TAB_NAME_ISSUE_OVERVIEW = "IssueOverview";
export const TAB_NAME_PROFILE = "PROFILE";


const ActionBarStyles = {
    backgroundColor: Theme.colors.primary,
    color: "white"
}

export default class Router
{
    static createInitialStack = (loggedIn) => 
    {
        return createSwitchNavigator(
            {
                [STACK_NAME_AUTH]: Router.createAuthRouter(),
                [STACK_NAME_HOME]: Router.createHomeRouter()
            },
            {
                initialRouteName: loggedIn ? STACK_NAME_HOME : STACK_NAME_AUTH
            }
        )
    }    
  
  static createAuthRouter = ()  => 
  {
    return createStackNavigator(
    {
        [SCREEN_NAME_AUTH_LOGIN]: 
        { 
            screen: ScreenLogin, 
            navigationOptions : getNavigationOptions("Authentication") 
        },
        [SCREEN_NAME_AUTH_REGISTER]: 
        {
            screen: ScreenRegister, 
            navigationOptions : getNavigationOptions("Register Account")
        }
    },   
    {
      initialRouteName: SCREEN_NAME_AUTH_LOGIN,
      backBehavior: "initialRoute"
    }); 
  }

  static createHomeRouter = () => 
  {
    return createMaterialTopTabNavigator(
        {
          [TAB_NAME_ISSUE_OVERVIEW]: {
            screen: ScreenHome,
            navigationOptions: {
              tabBarLabel: "Home",
              tabBarIcon: ({ tintColor }) => (
                <Icon name="home" size={30} color={tintColor} />
              )
            }
          },
          [TAB_NAME_PROFILE]: {
            screen: ScreenProfile,
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
  }
}
 

const getNavigationOptions = (title) =>
{
    return  ({navigation}) => ({
        title: title, 
        headerStyle: {backgroundColor: Theme.colors.primary},
        headerTitleStyle: {color: "white"},
        headerTintColor: "white" 
    });
}