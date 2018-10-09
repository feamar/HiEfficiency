
import React from 'react';

import Theme from './app/styles/Theme';
import {Provider as ThemeProvider, Portal} from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import Router from './app/components/routing/Router'
import {StatusBar} from "react-native";
import {createStore, Store, applyMiddleware} from "redux";
import {Provider as ReduxProvider} from "react-redux";
import ReducerInitial from "./app/redux/reducers/ReducerInitial";
import ScreenSplash from './app/components/screens/ScreenSplash';
import FirebaseManager from './app/components/firebase/FirebaseManager';
import DatabaseProvider from './app/providers/DatabaseProvider';
import FirestoreFacade from './app/components/firebase/FirestoreFacade';
import update from 'immutability-helper';
import { ReduxState } from './app/redux/ReduxState';
import { Spec } from "immutability-helper";
import DocumentUser from './app/dtos/firebase/firestore/documents/DocumentUser';
import MiddlewareClassConversion from './app/redux/middleware/MiddlewareClassConversion';

if (__DEV__ == false) 
{   console.log = () => {};}

const Database = FirestoreFacade.Instance;

type State = 
{
  signedIn: boolean,
  checkedSignIn: boolean,
  shouldSplash: boolean,
  dialogs: Array<JSX.Element>
}


export default class App extends React.Component<any, State>
{

  private readonly store: Store<ReduxState>;
  private readonly unsubscribers: Array<() => void>;
  private timerIsSet: boolean;

  constructor(props: any) 
  {
    super(props);

    this.state = 
    {
      signedIn: false,
      checkedSignIn: false,
      shouldSplash: true,
      dialogs: []
    };

    this.store = createStore(ReducerInitial, applyMiddleware(MiddlewareClassConversion));
    this.unsubscribers = [];
    this.timerIsSet = false;

    this.unsubscribers.push(this.store.subscribe(this.onReduxStateChanged));
  }

  addDialog = (dialog: JSX.Element) =>
  {
    if(this.state.dialogs.indexOf(dialog) < 0)
    {
      const newDialogs = update(this.state.dialogs, {$push: [dialog]});
      this.setState({dialogs: newDialogs});
    }
  }

  removeDialog = (dialog: JSX.Element) =>
  {
    const index: number = this.state.dialogs.indexOf(dialog);
    if(index < 0)
    {   return false;}

    const newDialogs: Array<JSX.Element> = update(this.state.dialogs, {$splice: [[index, 1]]});
    this.setState({dialogs: newDialogs});
    return true;
  }

  onReduxStateChanged = async () =>
  {
    const globalState: ReduxState = this.store.getState();
    if(this.state.checkedSignIn == false)
    {   
      this.setState({checkedSignIn: true, signedIn: globalState.user != undefined});
      await this.ensureUserAccount(globalState);
    }

    const signedIn: boolean = globalState.user != undefined;
    if(signedIn != this.state.signedIn)
    {   this.setState({signedIn: signedIn});}
  }

  ensureUserAccount = async (globalState: ReduxState) =>
  {
    if(globalState == undefined || globalState.user == undefined)
    {
       this.setState({signedIn: false});
       return;
    }

    var updates: Spec<DocumentUser, never> | undefined = undefined;
    if(globalState.user.document == undefined || (globalState.user.document.data.teams == undefined && globalState.user.document.data.name == undefined))
    {   updates = {teams: {$set: []}, name: {$set: "Unknown"}};}
    else if(globalState.user.document.data.teams == undefined)
    {   updates = {teams: {$set: []}};}
    else if(globalState.user.document.data.name == undefined)
    {   updates = {name: {$set: "Unknown"}};}


    if(updates != undefined)
    {
      await Database.inDialog(this.addDialog, this.removeDialog, "Creating Profile", async (execute) => 
      {
        //We have to check for undefined again, because we're in an async function.
        if(updates != undefined)
        {
          const crud = Database.updateUser(globalState.user!.document.id!, globalState.user!.document.data, updates);
          const result = await execute(crud, false);
  
          console.log("Successful: " + result.successful);
          if(result.successful == false)
          {   this.setState({signedIn: false});}
        }
      });
    }
  }
  

  componentDidMount() 
  {
    FirebaseManager.Instance.attach(this.store);
  }

  componentWillUnmount() 
  {   
    FirebaseManager.Instance.detach();
  }

  setShouldSplash = (shouldSplash: boolean) =>
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
}

