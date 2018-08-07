import React from "react";
import { ScrollView, Text, Linking, View } from "react-native";
import { Card, Button } from "react-native-elements";

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

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.addTeam = this.addTeam.bind(this);
    this.state = {
      teams: [],
    }
  }

  addTeam = (teamDocument) => {
    currentTeams = this.state.teams;
    currentTeams.push(teamDocument);
    this.setState({teams: currentTeams});
  }

  componentDidMount() {
    let _this = this;
    console.ignoredYellowBox = ['Setting a timer'];
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        getUsers().doc(user.uid).get().then(function(doc) {
            if (doc.exists) {
                doc.data().teams.map((teamIdentifier) => getTeams().doc(teamIdentifier).get().then(_this.addTeam));
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

  getStoriesUnderTeam(teamDocument) {
    let stories = teamDocument.ref.collection('stories');
    stories.add({name: 'Nieuw team'});
    return stories;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          {this.state.teams.map((teamDocument) => (
            <Card title={`CARD ${teamDocument.data().name}`} key={teamDocument.id}>
              <Text style={{ marginBottom: 10 }}>
                Team {teamDocument.data().name}.
              </Text>
              <Button
              title="VIEW NOW"
                backgroundColor="#03A9F4"
                onPress={() => this.getStoriesUnderTeam(teamDocument)}
              />
            </Card>
          ))}
        </ScrollView>
      </View>
    );
  }
}
