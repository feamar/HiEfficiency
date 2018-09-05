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

import ScreenRegister from "../screens/ScreenRegister";
import ScreenLogin from "../screens/ScreenLogin";
import ScreenTeams from "../screens/ScreenTeams";
import ScreenProfile from "../screens/ScreenProfile";
import ScreenStoryBoard from '../screens/ScreenStoryBoard';
import ScreenStoryDetailsInterruptions from '../screens/ScreenStoryDetailsInterruptions';
import ScreenStoryCreate from '../screens/ScreenStoryCreate';
import ScreenTeamEdit from '../screens/ScreenTeamEdit';
import ScreenDeveloper from "../screens/ScreenDeveloper";

import Theme from '../../styles/Theme';
import CustomDrawer from './CustomDrawer';
import CustomHeaderTitle from "./CustomHeaderTitle";
export const STACK_NAME_AUTH = 'Auth';
export const STACK_NAME_HOME = 'Home';
export const STACK_NAME_STORIES = 'Stories';
export const STACK_NAME_PROFILE = "Profile";
export const STACK_NAME_TEAMS = "Teams";
export const STACK_NAME_STORY_BOARD = "StoryBoard";
export const STACK_NAME_STORY_DETAILS = "StoryDetails";

export const SCREEN_NAME_AUTH_LOGIN = 'Login';
export const SCREEN_NAME_AUTH_REGISTER = 'Register';

export const SCREEN_NAME_STORY_BOARD_UNFINISHED = 'StoryBoardUnfinished';
export const SCREEN_NAME_STORY_BOARD_FINISHED = "StoryBoardFinished";
export const SCREEN_NAME_STORY_DETAILS_INTERRUPTIONS = 'Interruptions';
export const SCREEN_NAME_STORY_DETAILS_INFO = 'Info';
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
//const Values = [
//  ScreenRegister, ScreenLogin, ScreenTeams, ScreenProfile, ScreenStoryBoard, 
//  ScreenStoryDetailsInterruptions, ScreenStoryDetailsInfo, ScreenStoryCreate, ScreenTeamEdit, ScreenDeveloper
//]

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
      [STACK_NAME_STORY_BOARD]:
      {
        screen: Router.createStoryBoardStack(),
        navigationOptions: getNavigationOptions("Storyboard", getBackIcon(), true)
      },
      [STACK_NAME_STORY_DETAILS]:
      {
        screen: Router.createStoryDetailsStack(),
        navigationOptions: getNavigationOptions("Story Details", getBackIcon(), true, )
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

  static createStoryBoardStack = () =>
  {
    return createMaterialTopTabNavigator ({
      [SCREEN_NAME_STORY_BOARD_UNFINISHED]:
      {
        screen: (props) => <ScreenStoryBoard {...props} mode={ScreenStoryBoard.MODE_UNFINISHED} />,
        navigationOptions: getNavigationOptions("Story Board", getBackIcon())
      },
      [SCREEN_NAME_STORY_BOARD_FINISHED]:
      {
        screen: (props) => <ScreenStoryBoard {...props} mode={ScreenStoryBoard.MODE_FINISHED} />,
        navigationOptions: getNavigationOptions("Finished", getBackIcon())
      }
    },
    {
      initialRouteName: SCREEN_NAME_STORY_BOARD_UNFINISHED,
      tabBarOptions: getTabBarOptions()
    });
  }

  static createStoryDetailsStack = () =>
  {
    return createMaterialTopTabNavigator ({
      [SCREEN_NAME_STORY_DETAILS_INTERRUPTIONS]:
      {
        screen: ScreenStoryDetailsInterruptions,
        navigationOptions: getNavigationOptions("Interruptions", getBackIcon())
      },
      [SCREEN_NAME_STORY_DETAILS_INFO]:
      {
        screen: ScreenStoryCreate,
        navigationOptions: getNavigationOptions("Information", getBackIcon())
      } 
    },
    {
      initialRouteName:SCREEN_NAME_STORY_DETAILS_INTERRUPTIONS,
      tabBarOptions: getTabBarOptions()
    });
  }
}

const getHamburgerIcon = () => (navigation) =>
{
  return <Icon onPress={() => navigation.openDrawer()} name= "menu" color="white" underlayColor="transparent" />
}

const getBackIcon = () => (navigation) =>
{
  return <Icon onPress={() => navigation.goBack()} name= "arrow-back" color="white" underlayColor="transparent" />
}

const getTabBarOptions = () =>
{
  return {
    tabStyle: {},
    indicatorStyle: {
      backgroundColor: Theme.colors.accent
    },
    style: {
      backgroundColor: Theme.colors.primary
    }
  }
}

const getNavigationOptions = (title, action, removeHeaderShadow) =>
{
    return  (props) =>
    {
      const navigation = props.navigation;
      var headerLeft = null;
      if (action)
      {   headerLeft = action(navigation);}

      const options = {
        title: title,
        headerStyle: {
          backgroundColor: Theme.colors.primary,
        },
        headerTitleStyle: {paddingLeft: 0, flex: 1},
        headerTintColor: "white",
        headerLeft: headerLeft,
        headerLeftContainerStyle: {
          paddingLeft: 15
        },
        headerTitle: <CustomHeaderTitle title={title} subtitle={navigation.getParam("subtitle")} navigation={navigation} />
      }

      if(removeHeaderShadow)
      {
        options.headerStyle.shadowOpacity =  0;
        options.headerStyle.shadowOffset = {height: 0, width: 0};
        options.headerStyle.shadowRadius = 0;
        options.headerStyle.elevation = 0;
        options.headerStyle.shadowOpacity = 0;
      }

      return options;
    };
}

