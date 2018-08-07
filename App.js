import React from 'react';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import NewStory from './NewStory';
import StoriesOverview from './StoriesOverview';
import StoryDetails from './StoryDetails';
import Auth from './auth/index';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const RootStack = createStackNavigator(
  {
	  Home: StoriesOverview,
	  Details: StoryDetails,
	  NewStory: NewStory,
	  Auth: Auth
  },
  {
	initialRouteName: 'Home'
  }
);

export default class App extends React.Component {


  render() {
    console.ignoredYellowBox = ['Setting a timer'];
    var firebaseConfig = require('./firebase.config.json');
    !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

    return <RootStack />;
  }
}
