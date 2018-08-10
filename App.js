import React from 'react';
import { AppLoading, Font } from 'expo';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import NewStory from './NewStory';
import StoriesOverview from './StoriesOverview';
import StoryDetails from './StoryDetails';
import { createRootNavigator } from './auth/router';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { initFirebase, hookIntoUserSignin } from './FirebaseAdapter';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentDidMount() {
    this.loadFonts();
    initFirebase();
    hookIntoUserSignin(() => this.setState({ signedIn: true, checkedSignIn: true }),
                       () => this.setState({ signedIn: false, checkedSignIn: true }));
  }

  render() {
    const { checkedSignIn, signedIn, fontsLoaded } = this.state;

    if (!checkedSignIn || !fontsLoaded) {
      return null;
    }

    RootStack = createStackNavigator(
      {
        Overview: StoriesOverview,
        Details: StoryDetails,
        Auth: createRootNavigator(signedIn)
      },
      {
        initialRouteName: 'Auth'
      }
    )
    return <RootStack />;
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
