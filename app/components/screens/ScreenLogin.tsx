import React from "react";
import { View, ToastAndroid, StyleSheet} from "react-native";
import {Button,  Card, TextInput, Text} from 'react-native-paper';

import {SCREEN_NAME_AUTH_REGISTER} from '../routing/Router';
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import Theme from '../../styles/Theme';
import WithDialogContainer, { WithDialogContainerProps } from "../../hocs/WithDialogContainer";
import { HiEfficiencyNavigator } from "../routing/RoutingTypes";
import ActionUserLoggedIn from "../../redux/actions/user/ActionUserLoggedIn";
import { Dispatch } from "redux";
import WithReduxSubscription from "../../hocs/WithReduxSubscription";

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
  card: {
   
    marginLeft: 20,
    marginRight:20
  },
  input:{ 
    marginLeft: 5,
    marginRight: 5
  } ,
  button_login:{
      marginTop: 30
  }, 
  button_register:
  {

  },
  header:
  {
    padding: 20,
    width: "100%",
    backgroundColor: Theme.colors.primary  
  },
  title:
  {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,   
    textAlign: "center" 
  }
}); 

interface ReduxDispatchProps
{
  onUserLoggedIn: (action: ActionUserLoggedIn) => ActionUserLoggedIn
}

const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatchProps =>
{
  return {
    onUserLoggedIn: (action: ActionUserLoggedIn) => dispatch(action)
  }
}

type Props = ReduxDispatchProps & WithDatabaseProps & WithDialogContainerProps & 
{
  navigation: HiEfficiencyNavigator
}

type State =  
{
  email: string,
  password: string
}

class ScreenLogin extends React.Component<Props, State>
{
  constructor(props: Props)
  {
    super(props);
    this.state =
    {
      email: '', 
      password: '',
    }
  } 

  onEmailChange = (value: string) =>
  {   this.setState({email: value});}

  onPasswordChange = (value: string) =>
  {   this.setState({password: value});}

  handleLogin = () => 
  {
    if(this.state.email == undefined || this.state.email == "")
    {   
      ToastAndroid.show("Please enter an e-mail address first.", ToastAndroid.LONG);
      return;
    }
    
    if(this.state.password == undefined || this.state.password == "")
    {
      ToastAndroid.show("Please enter a password first.", ToastAndroid.LONG);
      return;
    }

    this.setState({email: this.state.email.trim()}, async () => 
    {
      await this.props.database.inDialog("dialog-logging-in", this.props.addDialog, this.props.removeDialog, "Logging In", async (execute) => 
      {   
        const crud = this.props.database.loginUser(this.state.email, this.state.password, this.props.onUserLoggedIn);
        await execute(crud, false);
      }, 200);
    });
  }

  handleRegister = () => 
  {
    this.props.navigation.navigate(SCREEN_NAME_AUTH_REGISTER);
  }

  render()
  {
    return(
      <View style={styles.wrapper}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Login</Text>
          </View> 
          <Card.Content>  
            <TextInput style={styles.input}  label="E-mail address" value={this.state.email} onChangeText={this.onEmailChange} />
            <TextInput style={styles.input} secureTextEntry  label="Password" value={this.state.password} onChangeText={this.onPasswordChange} />
            <Button style={styles.button_login} dark mode="contained" onPress={this.handleLogin}>Login</Button>
            <Button style={styles.button_register} onPress={this.handleRegister}>Register</Button>
          </Card.Content>     
        </Card> 
      </View>     
    );
  }
}

const hoc1 = WithReduxSubscription<ScreenLogin, ScreenLogin, Props, {}, ReduxDispatchProps>(undefined, mapDispatchToProps)(ScreenLogin);
const hoc2 = WithDatabase(hoc1);
const hoc3 = WithDialogContainer(hoc2);

export default hoc3;