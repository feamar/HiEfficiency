import React from "react";
import { View } from "react-native";
import { signInWithEmailAndPassword } from "../firebase/FirebaseAdapter";

import {
  Button,
  Card,
  CardContent,
  TextInput,
  Title,
  Text
} from 'react-native-paper';

import {SCREEN_NAME_AUTH_REGISTER} from '../routing/Router';

import Theme from '../../styles/Theme';

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

export default class ScreenLogin extends React.Component 
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
    signInWithEmailAndPassword(this.state.email, this.state.password);
  }

  handleRegister = () => 
  {
    console.log("Handle register clicked: " + SCREEN_NAME_AUTH_REGISTER);
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
          <CardContent>  
            <TextInput style={styles.input} id="email" name="email" label="E-mail address" value={this.state.email} onChangeText={this.handleInputChange("email")} />
            <TextInput style={styles.input} type="password" id="password" name="password" label="Password" value={this.state.password} onChangeText={this.handleInputChange("password")} />
            <Button style={styles.buttons.login} dark raised primary variant="contained" onPress={this.handleLogin}>Login</Button>
            <Button style={styles.buttons.register} flat primary onPress={this.handleRegister}>Register</Button>
          </CardContent>     
        </Card> 
      </View>     
    );
  }
}
