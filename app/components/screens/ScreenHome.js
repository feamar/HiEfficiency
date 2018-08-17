import React from "react";
import { ScrollView, Linking, View } from "react-native";
import { Card } from "react-native-elements";
import {
  Button,
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Input,
  Item,
} from 'native-base';
import { getRootCollection, getStories, getUsers, getTeams, hookIntoUserSignin, signOut } from '../firebase/FirebaseAdapter';
import { Team } from '../teams/Team';
import { SCREEN_NAME_STORY_BOARD } from '../routing/Router';

export default class ScreenHome extends React.Component {
  constructor(props) {
    super(props);
    this.addTeam = this.addTeam.bind(this);
    this.createTeam = this.createTeam.bind(this);
    this.signOutAndRedirect = this.signOutAndRedirect.bind(this);
    this.state = {
      teams: [],
      user: undefined,
      teamModalVisible: false,
      modalConfirm: () => {},
  }
}

  signOutAndRedirect = () => {
    signOut().then(() => this.props.navigation.navigate("SignedOut"));
  }

  addTeam = (teamDocument) => {
    currentTeams = this.state.teams;
    currentTeams.push(teamDocument);
    this.setState({teams: currentTeams});
  }

  getTeamsForUser = (user) => {
    let _this = this;
    getUsers().doc(user.uid).get().then(function(doc) {
      _this.snapshotUser(doc);
    }).catch(function(error) {
        console.log("Error getting user profile:", error);
    });
  }

  componentDidMount() {
    this.signInUnsubscriber = hookIntoUserSignin(this.getTeamsForUser, this.signOutAndRedirect);
  }

  componentWillUnmount()
  {
    if(this.signInUnsubscriber)
    { this.signInUnsubscriber();}
  }

  snapshotUser = (userDocument) => {
    let _this = this;
    userDocument.ref.onSnapshot(function(doc) {
      if (doc.exists) {
          _this.setState({user: doc, teams: []});
          doc.data().teams.map((teamIdentifier) => getTeams().doc(teamIdentifier).get().then(_this.addTeam));
      } else {
          console.log("Signed up user does not have a profile for user id: " + userDocument.id);
      }
    });
  }

  closeTeamModal = () => {
    this.setState({teamModalVisible: false, modalConfirm: () => {}});
  }

  showCreateTeam = () => {
    this.setState({teamModalVisible: true, modalConfirm: this.createTeam});
  }

  showJoinTeam = () => {
    this.setState({teamModalVisible: true, modalConfirm: this.joinTeam});
  }

  addTeamToUser = (id) => {
    let teams = this.state.user.data().teams;
    teams.push(id);
    this.state.user.ref.update({
        teams: teams
    });
  }

  createTeam = (teamName, teamCode) => {
    getTeams().add({
      name: teamName,
      code: teamCode
    }).then((teamDocumentReference) => {
      this.addTeamToUser(teamDocumentReference.id);
    });
  }

  joinTeam = (teamName, teamCode) => {
    let _this = this;
    let joined = false;
    let teamsFound = false;
    getTeams().where("name", "==", teamName).get().then((result) => {
        result.forEach((doc) => {
          teamsFound = true;
          if (doc.data().code == teamCode) {
            _this.addTeamToUser(doc.id);
            joined = true;
          }
        })
        if (!teamsFound) {
          alert('No team with name: ' + teamName + ' was found');
        } else {
          if (!joined) {
            alert('A team with name: ' + teamName + ' was found, but code: ' + teamCode + ' was incorrect');
          }
        }
      }
    );
  }

  leaveTeam = (teamDocument) => {
    let teams = this.state.user.data().teams;
    let index = teams.indexOf(teamDocument.id);
    teams.splice(index, 1);
    this.state.user.ref.update({
      teams: teams
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', paddingTop: 20, paddingHorizontal: 15, justifyContent:'space-between' }}>
          <Button onPress={this.showCreateTeam} >
            <Text>Create team</Text>
          </Button>
          <Button onPress={this.showJoinTeam} >
            <Text>Join team</Text>
          </Button>
        </View>
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          {this.state.teams.map((teamDocument) => (
            <Card title={`Team: ${teamDocument.data().name}`} key={teamDocument.id}>
              <Text style={{ marginBottom: 10 }}>
                Team {teamDocument.data().name}.
              </Text>
              <View style={{ flexDirection: 'row', justifyContent:'space-between' }}>
                <Button
                  backgroundColor="#03A9F4"
                  onPress={() => {
                    this.props.navigation.navigate(SCREEN_NAME_STORY_BOARD, {teamId: teamDocument.id})}
                  }
                >
                  <Text>Go to storyboard</Text>
                </Button>
                <Button
                  backgroundColor="#03A9F4"
                  onPress={() => this.leaveTeam(teamDocument)}
                >
                  <Text>Leave Team</Text>
                </Button>
              </View>
            </Card>
          ))}
        </ScrollView>
        <Team
          visible={this.state.teamModalVisible}
          onConfirm={this.state.modalConfirm}
          close={this.closeTeamModal} />
      </View>
    );
  }
}
