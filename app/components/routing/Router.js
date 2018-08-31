import React from 'react';
import
{
    createStackNavigator,
    createMaterialTopTabNavigator,
    createSwitchNavigator,
    createDrawerNavigator
} from "react-navigation";

import {View} from "react-native";
import {Icon} from "react-native-elements";

import { Platform, StatusBar } from "react-native";
import ScreenRegister from "../screens/ScreenRegister";
import ScreenLogin from "../screens/ScreenLogin";
import ScreenTeams from "../screens/ScreenTeams";
import ScreenProfile from "../screens/ScreenProfile";
import ScreenStoryboard from '../screens/ScreenStoryboard';
import ScreenStoryDetails from '../screens/ScreenStoryDetails';
import Theme from '../../styles/Theme';
import CustomDrawer from './CustomDrawer';
import ScreenStoryCreate from '../screens/ScreenStoryCreate';
import ScreenTeamEdit from '../screens/ScreenTeamEdit';
import ScreenDeveloper from "../screens/ScreenDeveloper";

export const STACK_NAME_AUTH = 'Auth';
export const STACK_NAME_HOME = 'Home';
export const STACK_NAME_STORIES = 'Stories';
export const STACK_NAME_PROFILE = "Profile";
export const STACK_NAME_TEAMS = "Team";

export const SCREEN_NAME_AUTH_LOGIN = 'Login';
export const SCREEN_NAME_AUTH_REGISTER = 'Register';

export const SCREEN_NAME_STORY_BOARD = 'StoryBoard';
export const SCREEN_NAME_STORY_DETAILS = 'StoryDetails';
export const SCREEN_NAME_STORY_CREATE = "StoryCreate";

export const SCREEN_NAME_PROFILE = "Profile";
export const SCREEN_NAME_TEAMS = "Teams";
export const SCREEN_NAME_TEAM_EDIT = "TeamEdit";

export const SCREEN_NAME_DEVELOPER = "Development";

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
                [STACK_NAME_AUTH]: Router.createAuthStack(),
                [STACK_NAME_HOME]: Router.createHomeStack()
            },
            {
                initialRouteName: loggedIn ? STACK_NAME_HOME : STACK_NAME_AUTH
            }
        )
    }

  static createAuthStack = ()  =>
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

  static createHomeStack = ()  =>
  {
    return createDrawerNavigator({
        [STACK_NAME_TEAMS]:
        {
          screen: Router.createTeamsRouter(),
        },
        [STACK_NAME_PROFILE]:
        {
          screen: Router.createProfileRouter(),
        }
      },
      {
        initialRouteName: STACK_NAME_TEAMS,
        contentComponent: (props) => <CustomDrawer {...props} />,
      }
    );
  }
  
  static createProfileRouter = () =>
  {
    return createStackNavigator({
      [SCREEN_NAME_PROFILE]:
      {
        screen: ScreenProfile,
        navigationOptions: getNavigationOptions("Profile", getHamburgerIcon())
      }
    }, {
      initialRouteName: SCREEN_NAME_PROFILE
    });
  }

  static createTeamsRouter = () =>
  {
    return createStackNavigator({
      [SCREEN_NAME_TEAMS]:
      {
        screen: ScreenTeams,
        navigationOptions: getNavigationOptions("Teams", getHamburgerIcon())
      },
      [SCREEN_NAME_TEAM_EDIT]:
      {
        screen: ScreenTeamEdit,
        navigationOptions: getNavigationOptions("Edit Team", getBackIcon())
      },
      [SCREEN_NAME_STORY_BOARD]:
      {
        screen: ScreenStoryboard, 
        navigationOptions: getNavigationOptions("Storyboard", getBackIcon())
      },
      [SCREEN_NAME_STORY_DETAILS]:
      {
        screen: ScreenStoryDetails,
        navigationOptions: getNavigationOptions("Story Details", getBackIcon())
      },
      [SCREEN_NAME_STORY_CREATE]:
      {
        screen: ScreenStoryCreate,
        navigationOptions: getNavigationOptions("Story Information", getBackIcon())
      }
    }, {
      initialRouteName: SCREEN_NAME_TEAMS,
      backBehavior: "initialRoute"
    });
  }
}




const getHamburgerIcon = () => (navigation) =>
{
  return <View style={{paddingLeft: 15}}><Icon onPress={() => navigation.openDrawer()} name= "menu" color="white" underlayColor="transparent" /></View>
}

const getBackIcon = () => (navigation) =>
{
  return <View style={{paddingLeft: 15}}><Icon onPress={() => navigation.goBack()} name= "arrow-back" color="white" underlayColor="transparent" /></View>
}

const getNavigationOptions = (title, action) =>
{
    return  ({navigation}) => {
      var headerLeft = null;
      if (action) {
        headerLeft = action(navigation);
      }
      return {
        title: title,
        headerStyle: {backgroundColor: Theme.colors.primary},
        headerTitleStyle: {color: "white"},
        headerTintColor: "white",
        headerLeft: headerLeft
      }
    };
}
