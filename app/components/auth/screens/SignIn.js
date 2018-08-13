import React from "react";
import { View } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import { signInWithEmailAndPassword } from "../../firebase/FirebaseAdapter";

export default  class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    }
  }

  render() {
    return <View style={{ paddingVertical: 20 }}>
            <Card>
              <FormLabel>Email</FormLabel>
              <FormInput placeholder="Email address..." onChangeText={(text) => this.setState({email: text})}/>
              <FormLabel>Password</FormLabel>
              <FormInput secureTextEntry placeholder="Password..." onChangeText={(text) => this.setState({password: text})}/>

              <Button
                buttonStyle={{ marginTop: 20 }}
                backgroundColor="#03A9F4"
                title="SIGN IN"
                onPress={() => {
                  signInWithEmailAndPassword(this.state.email, this.state.password);
                }}
              />
              <Button
                buttonStyle={{ marginTop: 20 }}
                backgroundColor="transparent"
                textStyle={{ color: "#bcbec1" }}
                title="Sign Up"
                onPress={() => {
                  this.props.navigation.navigate("SignUp")}}
              />
            </Card>
          </View>
        }
}
