import React from "react";
import { View, StyleSheet } from "react-native";
//import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import Theme from "../../styles/Theme";
import {Button,Card,TextInput,Text} from 'react-native-paper';
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import WithDialogContainer, { WithDialogContainerProps } from "../../hocs/WithDialogContainer";
import ActionUserLoggedIn from "../../redux/actions/user/ActionUserLoggedIn";
import { Dispatch } from "redux";
import WithReduxSubscription from "../../hocs/WithReduxSubscription";

const styles = StyleSheet.create({
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
  },
  button_login:
  {
      marginTop: 30
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

type Props = WithDatabaseProps & WithDialogContainerProps & ReduxDispatchProps &
{

}

type State =  
{
  email?: string,
  password?: string,
  confirmation?: string
}

const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatchProps =>
{
  return {
    onUserLoggedIn: (action: ActionUserLoggedIn) => dispatch(action)
  }
}

class ScreenRegister extends React.Component<Props, State>
{
  constructor(props: Props) 
  {
    super(props);

    this.state = 
    {
      email: '',
      password: '',
      confirmation: '',
    }
  }

  onEmailChange = (value: string) =>
  {   this.setState({email: value});}

  onPasswordChange = (value: string) =>
  {   this.setState({password: value});}

  onConfirmationChange =(value: string) =>
  { this.setState({confirmation: value});}

  handleRegister = () => 
  {
    if(this.state.email == undefined || this.state.email == "")
    { 
      alert("Please enter an e-mail address.")
      return;
    }

    if(this.state.password == undefined || this.state.password == "")
    { 
      alert("Please enter a password.");
      return;
    }

    if (this.state.password != this.state.confirmation) 
    {
      alert('Password and confirmation are not the same.');
      return;
    }

    this.setState({email: this.state.email.trim()}, async () => {
      //State change will automatically navigate to HOME route if successful.
      await this.props.database.inDialog("dialog-registering-account", this.props.addDialog, this.props.removeDialog, "Registering Account", async (execute) => 
      {   
        const register = this.props.database.registerUser(this.state.email!, this.state.password!);
        const result = await execute(register, true);

        if(result.successful == false)
        {   return;}

        const login = this.props.database.loginUser(this.state.email!, this.state.password!, this.props.onUserLoggedIn);
        await execute(login, false);
        
      }, 200);
    });
  }

  render() 
  {
    return (
      <View style={styles.wrapper}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Register</Text>
          </View> 
          <Card.Content>  
            <TextInput style={styles.input} label="E-mail address" value={this.state.email} onChangeText={this.onEmailChange} />
            <TextInput style={styles.input} secureTextEntry  label="Password" value={this.state.password} onChangeText={this.onPasswordChange} />
            <TextInput style={styles.input} secureTextEntry  label="Confirm Password" value={this.state.confirmation} onChangeText={this.onConfirmationChange} />
            <Button style={styles.button_login} dark onPress={this.handleRegister}>Register</Button>
          </Card.Content>    
        </Card> 
      </View>   
    ); 
  }
}

const hoc1 = WithReduxSubscription<ScreenRegister, ScreenRegister, Props, {}, ReduxDispatchProps>(undefined, mapDispatchToProps)(ScreenRegister);
const hoc2 = WithDatabase(hoc1);
const hoc3 = WithDialogContainer(hoc2);

export default hoc3;