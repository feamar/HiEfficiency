import React from "react";
import { View } from "react-native";

import {
  Button,
  Card,
  TextInput,
  Title,
  Text
} from 'react-native-paper';

import {SCREEN_NAME_AUTH_REGISTER} from '../routing/Router';
import WithDatabase from "../../hocs/WithDatabase";
import Theme from '../../styles/Theme';
import WithDialogContainer from "../../hocs/WithDialogContainer";

const styles = {
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
  buttons:
  { 
    login:{
        marginTop: 30
    }, 
    register:{}
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
}; 

class ScreenLogin extends React.Component 
{
  constructor()
  {
    super();
    this.state =
    {
      email: '', 
      password: '',
    }
  } 

  handleInputChange = name => value =>
  {
    this.setState({[name]: value});
  } 

  handleLogin = () => 
  {
    this.setState({email: this.state.email.trim()}, async () => 
    {
      await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Loging In", async (execute) => 
      {   
        const crud = this.props.database.loginUser(this.state.email, this.state.password);
        await execute(crud);
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
            <TextInput style={styles.input} id="email" name="email" label="E-mail address" value={this.state.email} onChangeText={this.handleInputChange("email")} />
            <TextInput style={styles.input} secureTextEntry id="password" name="password" label="Password" value={this.state.password} onChangeText={this.handleInputChange("password")} />
            <Button style={styles.buttons.login} dark mode="contained" onPress={this.handleLogin}>Login</Button>
            <Button style={styles.buttons.register} flat primary onPress={this.handleRegister}>Register</Button>
          </Card.Content>     
        </Card> 
      </View>     
    );
  }
}

const hoc1 = WithDatabase(ScreenLogin);
const hoc2 = WithDialogContainer(hoc1);

export default hoc2;