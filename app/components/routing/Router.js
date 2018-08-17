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
import StoryBoard from '../stories/StoryBoard';
import StoryDetails from '../stories/StoryDetails';
import Theme from '../../styles/Theme';

export const STACK_NAME_AUTH = 'Auth';
export const STACK_NAME_HOME = 'Home';
export const STACK_NAME_STORIES = 'Stories';

export const SCREEN_NAME_AUTH_LOGIN = 'Login';
export const SCREEN_NAME_AUTH_REGISTER = 'Register';

export const SCREEN_NAME_STORY_BOARD = 'StoryBoard';
export const SCREEN_NAME_STORY_DETAILS = 'StoryDetails';

export const TAB_NAME_TEAM_OVERVIEW = 'TeamOverview';
export const TAB_NAME_PROFILE = 'Profile';


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
                [STACK_NAME_HOME]: Router.createHomeRouter(),
                [STACK_NAME_STORIES]: Router.createStoriesRouter()
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

  static createStoriesRouter = ()  =>
  {
    return createStackNavigator(
    {
        [SCREEN_NAME_STORY_BOARD]:
        {
            screen: StoryBoard,
            navigationOptions : getNavigationOptions("StoryBoard")
        },
        [SCREEN_NAME_STORY_DETAILS]:
        {
            screen: StoryDetails,
            navigationOptions : getNavigationOptions("Story Details")
        }
    },
    {
      initialRouteName: SCREEN_NAME_STORY_BOARD,
      backBehavior: "initialRoute"
    });
  }

  static createHomeRouter = () =>
  {
    return createMaterialTopTabNavigator(
        {
          [TAB_NAME_TEAM_OVERVIEW]: {
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
