import React from "react";
import { View } from "react-native";
import { Card, Button, Text } from "react-native-elements";
import { signOut, getUsers, getTeams, hookIntoUserSignin } from "../../FirebaseAdapter";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.signOutAndRedirect = this.signOutAndRedirect.bind(this);
    this.state = {
      name: undefined,
      initials: undefined,
      teams: []
    }
  }

  signOutAndRedirect = () => {
    signOut().then(() => this.props.navigation.navigate("SignedOut"));
  }

  displayUserProfileData = (user) => {
    let _this = this;
    getUsers().doc(user.uid).get().then(function(doc) {
        if (doc.exists) {
            // Map teams identifiers to documents
            _this.setState({name: doc.data().name, initials: doc.data().initials, teams: doc.data().teams});
        } else {
            console.log("Signed up user does not have a profile for user id: " + user.id);
        }
    }).catch(function(error) {
        console.log("Error getting user profile:", error);
    });
  }

  componentDidMount() {
    hookIntoUserSignin(this.displayUserProfileData, this.signOutAndRedirect);
  }

  render() {
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card title={this.state.name}>
          <View
            style={{
              backgroundColor: "#bcbec1",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: 40,
              alignSelf: "center",
              marginBottom: 20
            }}
          >
            <Text style={{ color: "white", fontSize: 28 }}>{this.state.initials}</Text>
          </View>
          <Button
            backgroundColor="#03A9F4"
            title="SIGN OUT"
            onPress={() => signOut().then(() => this.props.navigation.navigate("SignedOut"))}
          />
        </Card>
      </View>
    );
  }
}
