import React from "react";
import { View, ToastAndroid, StyleSheet} from "react-native";
import {Button,  Card, TextInput, Text} from 'react-native-paper';

import {SCREEN_NAME_AUTH_REGISTER} from '../routing/Router';
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import Theme from '../../styles/Theme';
import WithDialogContainer, { WithDialogContainerProps, WithDialogContainerState } from "../../hocs/WithDialogContainer";
import { HiEfficiencyNavigator } from "../routing/RoutingTypes";

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

type Props = WithDatabaseProps & WithDialogContainerProps & 
{
  navigation: HiEfficiencyNavigator
}

type State = WithDialogContainerState & 
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
      dialogs: []
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


      await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Loging In", async (execute) => 
      {   
        const crud = this.props.database.loginUser(this.state.email, this.state.password);
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
            <TextInput style={styles.input} id="email" name="email" label="E-mail address" value={this.state.email} onChangeText={this.onEmailChange} />
            <TextInput style={styles.input} secureTextEntry id="password" name="password" label="Password" value={this.state.password} onChangeText={this.onPasswordChange} />
            <Button style={styles.button_login} dark mode="contained" onPress={this.handleLogin}>Login</Button>
            <Button style={styles.button_register} flat primary onPress={this.handleRegister}>Register</Button>
          </Card.Content>     
        </Card> 
        {this.state.dialogs.map(dialog => dialog)}
      </View>     
    );
  }
}

const hoc1 = WithDatabase(ScreenLogin);
const hoc2 = WithDialogContainer(hoc1);

export default hoc2;