import React from "react";
import { View } from "react-native";
import { Card, Button, Text } from "react-native-elements";
import { signOut } from "../auth";
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

function getUsers() {
  var firebaseConfig = require('./../../firebase.config.json');
  !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
  store = firebase.firestore();
  store.settings({timestampsInSnapshots: true});
  return store.collection('users');
}

function getTeams() {
  var firebaseConfig = require('./../../firebase.config.json');
  !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
  store = firebase.firestore();
  store.settings({timestampsInSnapshots: true});
  return store.collection('teams');
}

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      initials: undefined,
      teams: []
    }
  }

  componentDidMount() {
    _this = this;
    console.ignoredYellowBox = ['Setting a timer'];
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
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
      } else {
        signOut().then(() => this.props.navigation.navigate("SignedOut"));
      }
    });
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
