import React from 'react';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import NewStory from './NewStory';
import StoriesOverview from './StoriesOverview';
import StoryDetails from './StoryDetails'; 

const RootStack = createStackNavigator(
  {
	  Home: StoriesOverview,
	  Details: StoryDetails,
	  NewStory: NewStory 
  },
  {
	initialRouteName: 'Home'
  }
);

export default class App extends React.Component {

	
  render() {
    return <RootStack />;
  }
}