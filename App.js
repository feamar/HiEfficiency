import React from 'react';
import FirebaseAdapter from "./app/components/firebase/FirebaseAdapter";

import Theme from './app/styles/Theme';
import {Provider as ThemeProvider, Portal} from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import Router from './app/components/routing/Router'
import {StatusBar} from "react-native";
import UtilityObject from './app/utilities/UtilityObject';
import {createStore} from "redux";
import {Provider as ReduxProvider} from "react-redux";
import ReducerInitial from "./app/redux/reducers/ReducerInitial";
import firebase from 'react-native-firebase';
import {onUserLoggedIn, onUserLoggedOut, onUserDataChanged, onUserJoinsTeam, onUserLeftTeam} from "./app/redux/reducers/ReducerUser";
import { connect } from 'react-redux'
import ScreenSplash from './app/components/screens/ScreenSplash';
import UtilityArray from './app/utilities/UtilityArray';
import FirebaseManager from './app/components/firebase/FirebaseManager';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false,
      shouldSplash: true
    };

    this.initializeCyclicJs();

    this.store = createStore(ReducerInitial);
    this.unsubscribers = [];
    this.timerIsSet = false;


    const unsubscriber = this.store.subscribe(this.onReduxStateChanged);
    this.unsubscribers.push(unsubscriber);
  }

  onReduxStateChanged = () =>
  {
    const globalState = this.store.getState();
    if(this.state.checkedSignIn == false)
    {   
      this.setState({checkedSignIn: true, signedIn: globalState.user != undefined});
    }

    const signedIn = globalState.user != undefined;
    if(signedIn != this.state.signedIn)
    {   this.setState({signedIn: signedIn});}
  }

  componentDidMount() 
  {
    FirebaseManager.Instance.attach(this.store);
  }

  componentWillUnmount() 
  {   
    FirebaseManager.Instance.detach();
  }

  setShouldSplash = (shouldSplash) =>
  {   this.setState({shouldSplash: shouldSplash})}

  render() {
    if(this.state.shouldSplash && this.timerIsSet == false)
    {
        this.timerIsSet = true;
        setTimeout(() => {this.setShouldSplash(false)}, __DEV__ ? 0 : 3000);
    }

    if (this.state.checkedSignIn == false || this.state.shouldSplash) 
    {   return <ScreenSplash />}

    const RouteStack = Router.createInitialStack(this.state.signedIn, this.state.shouldSplash);

    return(
      <ReduxProvider store={this.store}>
        <ThemeProvider theme={Theme}>
          <MenuProvider>
            <StatusBar backgroundColor={Theme.colors.primaryDark}/>
            <Portal.Host>
              <RouteStack />
            </Portal.Host>  
          </MenuProvider>
        </ThemeProvider>
      </ReduxProvider>
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

