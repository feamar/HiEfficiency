if (__DEV__ == false) 
{   console.log = () => {};}

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
import { connect } from 'react-redux'
import ScreenSplash from './app/components/screens/ScreenSplash';
import UtilityArray from './app/utilities/UtilityArray';
import FirebaseManager from './app/components/firebase/FirebaseManager';
import DatabaseProvider from './app/providers/DatabaseProvider';
import FirestoreFacade from './app/components/firebase/FirestoreFacade';
import update from 'immutability-helper';

const Database = FirestoreFacade.Instance;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false,
      shouldSplash: true,
      dialogs: []
    };

    this.initializeCyclicJs();

    this.store = createStore(ReducerInitial);
    this.unsubscribers = [];
    this.timerIsSet = false;


    const unsubscriber = this.store.subscribe(this.onReduxStateChanged);
    this.unsubscribers.push(unsubscriber);
  }

  addDialog = (dialog) =>
  {
    if(this.state.dialogs.indexOf(dialog) < 0)
    {
      const newDialogs = update(this.state.dialogs, {$push: [dialog]});
      this.setState({dialogs: newDialogs});
    }
  }

  removeDialog = (dialog) =>
  {
    const index = this.state.dialogs.indexOf(dialog);
    if(index < 0)
    {   return false;}

    const newDialogs = update(this.state.dialogs, {$splice: [[index, 1]]});
    this.setState({dialogs: newDialogs});
  }

  onReduxStateChanged = async () =>
  {
    const globalState = this.store.getState();
    if(this.state.checkedSignIn == false)
    {   
      this.setState({checkedSignIn: true, signedIn: globalState.user != undefined});

      await this.ensureUserAccount(globalState);
    }

    const signedIn = globalState.user != undefined;
    if(signedIn != this.state.signedIn)
    {   this.setState({signedIn: signedIn});}
  }

  ensureUserAccount = async (globalState) =>
  {
    console.log("ensuring user account");

    if(globalState == undefined || globalState.user == undefined)
    {
      console.log("RETURNING!");
       this.setState({signedIn: false});
       return;
    }
    console.log("NOT RETURNING!: " + UtilityObject.stringify(globalState.user));

    var updates = undefined;
    if(globalState.user.data == undefined || (globalState.user.data.teams == undefined && globalState.user.data.name == undefined))
    {   updates = {teams: {$set: []}, name: {$set: "Unknown"}};}
    else if(globalState.user.data.teams == undefined)
    {   updates = {teams: {$set: []}};}
    else if(globalState.user.data.name == undefined)
    {   updates = {name: {$set: "Unknown"}};}

    console.log("Updates: " + UtilityObject.stringify(updates));

    if(updates != undefined)
    {
      await Database.inDialog(this.addDialog, this.removeDialog, "Creating Profile", async (execute) => 
      {
        const crud = Database.updateUser(globalState.user.uid, {}, updates);
        const result = await execute(crud);

        console.log("Successful: " + result.successful);
        if(result.successful == false)
        {   this.setState({signedIn: false});}
      });
    }

   

    console.log("done");
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

    const RouteStack = Router.createInitialStack(this.state.signedIn);

    return(
      <ReduxProvider store={this.store}>
        <ThemeProvider theme={Theme}>
            <MenuProvider>
              <StatusBar backgroundColor={Theme.colors.primaryDark}/>
              <Portal.Host>
                <DatabaseProvider database={Database}>
                  <RouteStack />
                </DatabaseProvider>
                {this.state.dialogs.map(dialog => dialog)}
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

