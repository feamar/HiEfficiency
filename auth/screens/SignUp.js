import React from "react";
import { View } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import { signUpWithEmailAndPassword } from "../../FirebaseAdapter";

export default class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      confirmation: ''
    }
  }

  render() {
    return <View style={{ paddingVertical: 20 }}>
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
    </View>;
  }
}
