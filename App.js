import React from 'react';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import StoriesOverview from './app/components/stories/StoriesOverview';
import StoryDetails from './app/components/stories/StoryDetails';
import { createRootNavigator } from './app/components/auth/Router';
import { initFirebase, hookIntoUserSignin } from './app/components/firebase/FirebaseAdapter';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      signedIn: false,
      checkedSignIn: false
    };

    this.initializeCyclicJs();
  }


  initializeCyclicJs = () => {
    JSON.decycle = function decycle(object, replacer) {

      var objects = new WeakMap();
      return (function derez(value, path) {


        var old_path;
        var nu;


        if (replacer !== undefined) {
          value = replacer(value);
        }


        if (
          typeof value === "object"
          && value !== null
          && !(value instanceof Boolean)
          && !(value instanceof Date)
          && !(value instanceof Number)
          && !(value instanceof RegExp)
          && !(value instanceof String)
        ) {


          old_path = objects.get(value);
          if (old_path !== undefined) {
            return { $ref: old_path };
          }


          objects.set(value, path);


          if (Array.isArray(value)) {
            nu = [];
            value.forEach(function (element, i) {
              nu[i] = derez(element, path + "[" + i + "]");
            });
          } else {


            nu = {};
            Object.keys(value).forEach(function (name) {
              nu[name] = derez(
                value[name],
                path + "[" + JSON.stringify(name) + "]"
              );
            });
          }
          return nu;
        }
        return value;
      }(object, "$"));
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

    if (!checkedSignIn || !fontsLoaded) { return null; }

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

    this.setState({ fontsLoaded: true });
  }
}
