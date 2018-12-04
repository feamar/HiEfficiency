import React from 'react';
import
{
    createStackNavigator,
    createMaterialTopTabNavigator,
    createSwitchNavigator,
    createDrawerNavigator,
    NavigationScreenProps,
    NavigationRoute,
    NavigationContainer,
    NavigationState
} from "react-navigation";


import ScreenRegister from "../screens/ScreenRegister";
import ScreenLogin from "../screens/ScreenLogin";
import ScreenTeams from "../screens/ScreenTeams";
import ScreenProfile from "../screens/ScreenProfile";
import ScreenStoryBoard from '../screens/ScreenStoryBoard';
import ScreenStoryDetailsTimeline from '../screens/ScreenStoryDetailsTimeline';
import ScreenStoryCreate from '../screens/ScreenStoryCreate';
import ScreenTeamEdit from '../screens/ScreenTeamEdit';
import ScreenStoryAnalysis from '../screens/ScreenStoryAnalysis';


import Theme from '../../styles/Theme';
import CustomDrawer from './CustomDrawer';
import CustomHeader from './CustomHeader';
import {  CustomNavigationParams } from './RoutingTypes';
import ScreenFeedback from '../screens/ScreenFeedback';
import ScreenAbout from '../screens/ScreenAbout';
import NavigationActionBack from './actions/NavigationActionBack';
import NavigationActionHamburger from './actions/NavigationActionHamburger';

export const STACK_NAME_AUTH = 'Auth';
export const STACK_NAME_HOME = 'Home';
export const STACK_NAME_STORIES = 'Stories';
export const STACK_NAME_PROFILE = "Profile";
export const STACK_NAME_TEAMS = "Teams";
export const STACK_NAME_FEEDBACK = "Feedback";
export const STACK_NAME_ABOUT = "About";
export const STACK_NAME_STORY_BOARD = "StoryBoard";
export const STACK_NAME_STORY_DETAILS = "StoryDetails";
export const SCREEN_NAME_AUTH_LOGIN = 'Login';
export const SCREEN_NAME_AUTH_REGISTER = 'Register';
export const SCREEN_NAME_FEEDBACK = "Feedback";
export const SCREEN_NAME_ABOUT = "About";

export const SCREEN_NAME_STORY_BOARD_TODO = 'Todo';
export const SCREEN_NAME_STORY_BOARD_DOING = "Doing";
export const SCREEN_NAME_STORY_BOARD_DONE = "Done";
export const SCREEN_NAME_STORY_DETAILS_INTERRUPTIONS = 'Timeline';
export const SCREEN_NAME_STORY_DETAILS_INFO = 'Info';
export const SCREEN_NAME_STORY_ANALYSIS = 'Analysis';
export const SCREEN_NAME_STORY_CREATE = "StoryCreate";
export const SCREEN_NAME_SPLASH = "Splash";
export const SCREEN_NAME_PROFILE = "Profile";
export const SCREEN_NAME_TEAMS = "Teams";
export const SCREEN_NAME_TEAM_EDIT = "TeamEdit";
export const SCREEN_NAME_DEVELOPER = "Development";

export const TAB_NAME_TEAM_OVERVIEW = 'TeamOverview';
export const TAB_NAME_PROFILE = 'Profile';

export const PARAM_NAME_HEADER_RIGHT_INJECTION = "header_right_injection";
export const PARAM_NAME_INITIAL_ROUTE_NAME = "initial_route_name";
export const PARAM_NAME_SUBTITLE = "subtitle";
export const PARAM_NAME_TITLE = "title";

export default class Router
{
  static createInitialStack = (loggedIn: boolean) =>
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
      [SCREEN_NAME_AUTH_LOGIN]: //Value is of type NavigationRouteConfig
      {
          screen: ScreenLogin,  //Of type NavigationContainer
          navigationOptions : getNavigationOptions("Authentication") //Of type NavigationScreenConfig<Options>
      },
      [SCREEN_NAME_AUTH_REGISTER]:
      {
          screen: ScreenRegister,
          navigationOptions : getNavigationOptions("Register Account", <NavigationActionBack />)
      }
    },
    {
      initialRouteName: SCREEN_NAME_AUTH_LOGIN
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
        },
        [STACK_NAME_FEEDBACK]:
        {
          screen: Router.createFeedbackRouter()
        },
        [STACK_NAME_ABOUT]:
        {
          screen: Router.createAboutRouter()
        }
        /*[SCREEN_NAME_DEVELOPER]:
        {
          screen: ScreenDeveloper
        }*/
      },
      {
        initialRouteName: STACK_NAME_TEAMS,
        contentComponent: (props) => <CustomDrawer {...props} />,
      }
    );
  }

  static createFeedbackRouter = () =>
  {
    return createStackNavigator({
      [SCREEN_NAME_FEEDBACK]:
      {
        screen: ScreenFeedback,
        navigationOptions: getNavigationOptions("Feedback", <NavigationActionHamburger />)
      }
    }, {
      initialRouteName: SCREEN_NAME_FEEDBACK
    });
  }

  static createAboutRouter = () =>
  {
    return createStackNavigator({
      [SCREEN_NAME_ABOUT]:
      {
        screen: ScreenAbout,
        navigationOptions: getNavigationOptions("About", <NavigationActionHamburger />)
      }
    }, {
      initialRouteName: SCREEN_NAME_ABOUT
    });
  }

  static createProfileRouter = () =>
  {
    return createStackNavigator({
      [SCREEN_NAME_PROFILE]:
      {
        screen: ScreenProfile,
        navigationOptions: getNavigationOptions("Profile", <NavigationActionHamburger />)
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
        navigationOptions: getNavigationOptions("Teams", <NavigationActionHamburger />)
      },
      [SCREEN_NAME_TEAM_EDIT]:
      {
        screen: ScreenTeamEdit,
        navigationOptions: getNavigationOptions("Edit Team", <NavigationActionBack />)
      },
      [STACK_NAME_STORY_BOARD]:
      {
        screen: Router.createStoryBoardStack(),
        navigationOptions: getNavigationOptions("Storyboard", <NavigationActionBack />)
      },
      [STACK_NAME_STORY_DETAILS]:
      {
        screen: Router.createStoryDetailsStack(),
        navigationOptions: getNavigationOptions("Story Details", <NavigationActionBack />)
      },
      [SCREEN_NAME_STORY_CREATE]:
      {
        screen: ScreenStoryCreate,
        navigationOptions: getNavigationOptions("Story Information", <NavigationActionBack />)
      }
    }, {
      initialRouteName: SCREEN_NAME_TEAMS
    });
  }

  static createStoryBoardStack = () =>
  {
    return createMaterialTopTabNavigator ({
      [SCREEN_NAME_STORY_BOARD_TODO]:
      {
        //Props parameter is of type: NavigationContainerProps & NavigationNavigatorProps<any>,
        screen: (props: NavigationContainer) => <ScreenStoryBoard {...props} mode={"Todo"} />,
        navigationOptions: getNavigationOptions("Todo", <NavigationActionBack />)
      },  
      [SCREEN_NAME_STORY_BOARD_DOING]:
      {
        screen: (props: NavigationContainer) => <ScreenStoryBoard {...props} mode={"Doing"} />,
        navigationOptions: getNavigationOptions("Doing", <NavigationActionBack />)
      },
      [SCREEN_NAME_STORY_BOARD_DONE]:
      {
        screen: (props: NavigationContainer) => <ScreenStoryBoard {...props} mode={"Done"} />,
        navigationOptions: getNavigationOptions("Done", <NavigationActionBack />)
      }
    },
    {
      initialRouteName: SCREEN_NAME_STORY_BOARD_TODO,
      tabBarOptions: getTabBarOptions(),
    });
  }

  static createStoryDetailsStack = () =>
  {
    return createMaterialTopTabNavigator ({
      [SCREEN_NAME_STORY_DETAILS_INTERRUPTIONS]:
      {
        screen: ScreenStoryDetailsTimeline,
        navigationOptions: getNavigationOptions("Timeline", <NavigationActionBack />)
      },
      [SCREEN_NAME_STORY_DETAILS_INFO]:
      {
        screen: ScreenStoryCreate,
        navigationOptions: getNavigationOptions("Information", <NavigationActionBack />)
      } ,
      [SCREEN_NAME_STORY_ANALYSIS]:
      {
        screen: ScreenStoryAnalysis,
        navigationOptions: getNavigationOptions("Analysis", <NavigationActionBack />)
      }
    },
    {
      initialRouteName: SCREEN_NAME_STORY_DETAILS_INTERRUPTIONS,
      tabBarOptions: getTabBarOptions(),
      backBehavior: "none"
    });
  }

  static getCurrentRoute = (navigationState: NavigationState): NavigationRoute =>
  {   return navigationState.routes[navigationState.index];}
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


const getNavigationOptions = (title: string, headerLeft?: JSX.Element) =>
{
    return  (props: NavigationScreenProps<CustomNavigationParams, CustomNavigationParams>) =>
    {
      //const subtitle = props.navigation.getParam(PARAM_NAME_SUBTITLE);
      const navigation = props.navigation;

      var headerRight: JSX.Element | undefined = undefined;
      const headerRightInjection = navigation.getParam(PARAM_NAME_HEADER_RIGHT_INJECTION);
      if(headerRightInjection)
      {   headerRight = headerRightInjection();}

      const options = {
        header: <CustomHeader left={headerLeft} title={navigation.getParam(PARAM_NAME_TITLE) || title} subtitle={navigation.getParam(PARAM_NAME_SUBTITLE)} right={headerRight} {...props} />
      }

      return options;
    };
}
