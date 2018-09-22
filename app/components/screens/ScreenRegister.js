import React from "react";
import { View } from "react-native";
//import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import FirebaseAdapter from "../firebase/FirebaseAdapter";
import Theme from "../../styles/Theme";
import {
  Button,
  Card,
  TextInput,
  Title,
  Text
} from 'react-native-paper';
import WithDatabase from "../../hocs/WithDatabase";
import WithDialogContainer from "../../hocs/WithDialogContainer";

const styles = 
{
  wrapper: 
  {
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
  card: 
  {
    marginLeft: 20,
    marginRight:20
  },
  input:
  { 
    marginLeft: 5,
    marginRight: 5
  } ,
  buttons:
  { 
    login:
    {
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
}

class ScreenRegister extends React.Component 
{
  constructor() 
  {
    super();
    this.state = 
    {
      email: '',
      password: '',
      confirmation: ''
    }
  }

  handleInputChange = name => value =>
  {
    this.setState({[name]: value});
  }  

  handleRegister = () => 
  {
    if(this.state.email == false)
    { 
      alert("Please enter an e-mail address.")
      return;
    }

    if (this.state.password != this.state.confirmation) 
    {
      alert('Password and confirmation are not the same.');
      return;
    }

    this.setState({email: this.state.email.trim()}, async () => {
      //State change will automatically navigate to HOME route if successful.
      await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Registering Account", async (execute) => 
      {   
        const register = this.props.database.registerUser(this.state.email, this.state.password);
        const result = await execute(register, true);

        if(result.successful == false)
        {   return;}

        const login = this.props.database.loginUser(this.state.email, this.state.password);
        await execute(login);
        
      }, 200);
    });
  }

  render() 
  {
    return <View style={styles.wrapper}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Register</Text>
        </View> 
        <Card.Content>  
          <TextInput style={styles.input} id="email" name="email" label="E-mail address" value={this.state.email} onChangeText={this.handleInputChange("email")} />
          <TextInput style={styles.input} secureTextEntry id="password" name="password" label="Password" value={this.state.password} onChangeText={this.handleInputChange("password")} />
          <TextInput style={styles.input} secureTextEntry id="confirmation" name="confirmation" label="Confirm Password" value={this.state.confirmation} onChangeText={this.handleInputChange("confirmation")} />
          <Button style={styles.buttons.login} dark raised primary variant="contained" onPress={this.handleRegister}>Register</Button>
        </Card.Content>    
      </Card> 
    </View>    
  }
}

const hoc1 = WithDatabase(ScreenRegister);
const hoc2 = WithDialogContainer(hoc1);

export default hoc2;