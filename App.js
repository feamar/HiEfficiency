import React from 'react';
import { AppLoading, Font } from 'expo';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import NewStory from './NewStory';
import StoriesOverview from './StoriesOverview';
import StoryDetails from './StoryDetails';
import Auth from './auth/index';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { initFirebase } from './FirebaseAdapter';

const RootStack = createStackNavigator(
  {
	  Home: StoriesOverview,
	  Details: StoryDetails,
	  Auth: Auth
  },
  {
	  initialRouteName: 'Auth'
  }
);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {fontsLoaded: false}
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    }

    initFirebase();
    return <RootStack />;
  }

    componentDidMount() {
      this.loadFonts();
    }

    // For basic functionality, we need to load some resources
    async loadFonts() {
      await Font.loadAsync({
        FontAwesome: require('@expo/vector-icons/fonts/FontAwesome.ttf'),
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'),
      });
      this.setState({fontsLoaded: true});
    }
}
