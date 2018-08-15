import React from "react";
import { View } from "react-native";
//import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import { signUpWithEmailAndPassword } from "../firebase/FirebaseAdapter";
import Theme from "../../styles/Theme";
import {
  Button,
  Card,
  CardContent,
  TextInput,
  Title,
  Text
} from 'react-native-paper';

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

export default class ScreenRegister extends React.Component 
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

    //State change will automatically navigate to HOME route if successful.
    signUpWithEmailAndPassword(this.state.email, this.state.password, this.state.confirmation);
  }

  render() 
  {
    return <View style={styles.wrapper}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Register</Text>
        </View> 
        <CardContent>  
          <TextInput style={styles.input} id="email" name="email" label="E-mail address" value={this.state.email} onChangeText={this.handleInputChange("email")} />
          <TextInput style={styles.input} type="password" id="password" name="password" label="Password" value={this.state.password} onChangeText={this.handleInputChange("password")} />
          <TextInput style={styles.input} type="password" id="confirmation" name="confirmation" label="Confirm Password" value={this.state.confirmation} onChangeText={this.handleInputChange("confirmation")} />
          <Button style={styles.buttons.login} dark raised primary variant="contained" onPress={this.handleRegister}>Register</Button>
        </CardContent>    
      </Card> 
    </View>    

    /*return <View style={{ paddingVertical: 20 }}>
      <Card>
        <FormLabel>Email</FormLabel>
        <FormInput placeholder="Email address..." onChangeText={(text) => this.setState({email: text})}/>
        <FormLabel>Password</FormLabel>
        <FormInput secureTextEntry placeholder="Password..." onChangeText={(text) => this.setState({password: text})}/>
        <FormLabel>Confirm Password</FormLabel>
        <FormInput secureTextEntry placeholder="Confirm Password..." onChangeText={(text) => this.setState({confirmation: text})}/>

        <Button
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#03A9F4"
          title="SIGN UP"
          onPress={() => {
            if (this.state.password == this.state.confirmation) {
              signUpWithEmailAndPassword(this.state.email, this.state.password, this.state.confirmation).then(
                () => this.props.navigation.navigate('SignedIn')
              );
            } else {
              alert('Password and confirmation are not the same');
            }
          }}
        />
        <Button
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="transparent"
          textStyle={{ color: "#bcbec1" }}
          title="Sign In"
          onPress={() => {
            this.props.navigation.navigate("SignIn")}}
        />
      </Card>
    </View>;*/
  }
}
