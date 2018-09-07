import React from 'react';
import FirebaseAdapter from "./app/components/firebase/FirebaseAdapter";

import Theme from './app/styles/Theme';
import {Provider, Portal} from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import Router from './app/components/routing/Router'
import {StatusBar} from "react-native";
import UtilityObject from './app/utilities/UtilityObject';
import {createStore} from "redux";
import {Provider as ReduxProvider} from "react-redux";
import ReducerInitial from "./app/redux/reducers/ReducerInitial";

const styles = {
  root: {
    backgroundColor: "purple"
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false,
      shouldSplash: true
    };

    this.timerIsSet = false;
    //this.store = createStore(ReducerInitial);

    this.initializeCyclicJs();
  }

  componentDidMount() {
    FirebaseAdapter.getCurrentUser(
      () => this.setState({ signedIn: true, checkedSignIn: true }),
      () => this.setState({ signedIn: false, checkedSignIn: true }));

  }

  componentWillUnmount() {
  }

  setShouldSplash = (shouldSplash) =>
  {   this.setState({shouldSplash: shouldSplash})}

  render() {
    const { checkedSignIn, signedIn} = this.state;

    if (!checkedSignIn) { return null; }

    const RouteStack = Router.createInitialStack(this.state.signedIn, this.state.shouldSplash);

    if(this.state.shouldSplash && this.timerIsSet == false)
    {
        this.timerIsSet = true;
        setTimeout(() => {this.setState({shouldSplash: false})}, 3000);
    }


    return(
        <Provider theme={Theme}>
          <MenuProvider>
            <StatusBar backgroundColor={Theme.colors.primaryDark}/>
            <Portal.Host>
              <RouteStack style={styles.root} />
            </Portal.Host>
          </MenuProvider>
        </Provider>
    );
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
}
