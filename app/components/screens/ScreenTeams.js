import React, { Component } from "react";
import { View } from "react-native";
import ListTeams from "../lists/teams/ListTeams";
import { ACTION_LEAVE, ACTION_RENAME, ACTION_INSPECT } from "../lists/teams/ListItemTeam";

import { SCREEN_NAME_STORY_BOARD } from '../routing/Router';

import { getUsers, getTeams, hookIntoUserSignin, signOut } from '../firebase/FirebaseAdapter';
import DialogPreferenceText from "../dialogs/preferences/DialogPreferenceText";
import { FABGroup } from "react-native-paper";

export default class ScreenTeams extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      teams: [],
      open: false
    }

    this.unsubscribers = [];
  }
  componentWillMount() {
    const unsubscriber = hookIntoUserSignin(this.onUserIsLoggedIn, this.onUserIsLoggedOut);
    this.unsubscribers.push(unsubscriber);
  }

  onUserIsLoggedIn = (user) => {
    var self = this;
    getUsers().doc(user.uid).get().then(function (doc) {
      //Subscribe to updates on the user document.
      const unsubscriber = doc.ref.onSnapshot(function (doc) {
        if (doc.exists) {
          self.setState({ user: doc, teams: [] });
          doc.data().teams.map((teamIdentifier) => { getTeams().doc(teamIdentifier).get().then(self.addTeam) });
        }
        else { console.log("Signed up user does not have a profile for user id: " + doc.id); }
      });
      this.unsubscribers.push(unsubscriber);
    })
      .catch(function (error) {
        console.log("Error getting user profile:", error);
      });
  }

  addTeam = (team) => {
    var teams = this.state.teams;
    var teamData = team.data();
    teamData.id = team.id;
    teams.push(teamData);
    this.setState({ teams: teams });
  }

  onUserIsLoggedOut = () => { signOut(); }

  componentWillUnmount() {
    for (var i = 0; i < this.unsubscribers.length; i++) { this.unsubscribers[i](); }
  }

  onItemSelected = (item, index) => {
    this.props.navigation.navigate(SCREEN_NAME_STORY_BOARD, { teamId: item.id });
  }

  onContextMenuItemSelected = (item, index, action) => {
    console.log("ACTION: " + action);
    switch (action) {
      case ACTION_LEAVE:

        //Update local state.
        let teams = this.state.teams;
        var index = getIndexOfTeamById(item.id);
        if (index > -1) {
          teams.splice(index, 1);
          this.setState({ teams: teams });
        }

        //Update Firestore state.
        this.state.user.ref.update({ teams: teams });
        break;

      case ACTION_RENAME:

        if (this.dialogRename) {
          this.currentlyRenamingTeam = item;
          this.dialogRename.setValue(item.name);
          this.dialogRename.base.handleOpen();
        }
        break;

      case ACTION_INSPECT:
        this.onItemSelected(item, index);
        break;
    }
  }

  onRenameDialogSubmitted = (value) => {
    //Update the team name in the state.
    var index = getIndexOfTeamById(this.currentlyRenamingTeam.id);
    if (index > -1) {
      var teams = this.state.teams;
      teams[index].name = value;
      this.setState({ teams: teams });
    }

    //Update the team name in the firstore database.
    getTeams().doc(this.currentlyRenamingTeam.id).get().then((doc) => {
      doc.ref.update({ name: value })
    })
  }

  onRenameDialogCanceled = () => { }

  onJoinDialogSubmitted = (name, securityCode) => {
    let joined = false;
    let teamsFound = false;
    getTeams().where("name", "==", name).get().then((result) => {
      result.forEach((doc) => {
        teamsFound = true;
        if (doc.data().code == securityCode) {
          this.addTeamToUser(doc.id);
          joined = true;
        }
      })

      if (!teamsFound) {
        alert('No team with name: ' + name + ' was found');
      }
      else {
        if (!joined) {
          alert('A team with name: ' + name + ' was found, but code: ' + securityCode + ' was incorrect');
        }
      }
    }
    );
  }

  handleCreateNewTeam = () => {

  }

  getFabGroupActions = () => {
    var actions = [];
    actions.push({ icon: "add", label: "Create Team", onPress: this.handleCreateNewTeam })
    actions.push({ icon: "device-hub", label: "Join Team", onPress: this.dialogJoinTeam.handleOpen() })

    return actions;
  }

  getIndexOfTeamById = (id) => {
    var teams = this.state.teams;
    for (var i = 0; i < teams.length; i++) {
      const current = teams[i];
      if (current.id == id) { return i; }
    }

    return -1;
  }

  render() {
    return (
      <View>
        <ListTeams items={this.state.teams} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
        <DialogPreferenceText ref={instance => this.dialogRename = instance} visible={false} label="Team Name" value="" onDialogSubmitted={this.onRenameDialogSubmitted} onDialogCanceled={this.onRenameDialogCanceled} />
        <DialogJoinTeam ref={instance => this.dialogJoinTeam = instance} visible={false} onDialogSubmitted={this.onJoinDialogSubmitted} />
        <FABGroup ref={instance => this.fabGroup = instance} color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open) => this.setState(open)} />
      </View>
    );
  }
}



/*import React from "react";
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

export default class ScreenTeams extends React.Component {
  constructor(props) {
    super(props);
    this.addTeam = this.addTeam.bind(this);
    this.createTeam = this.createTeam.bind(this);
    this.signOutAndRedirect = this.signOutAndRedirect.bind(this);
    this.state = {
      teams: [],
      user: undefined,
      teamModalVisible: false,
      modalConfirm: () => { },
    }
  }

  signOutAndRedirect = () => {
    signOut().then(() => this.props.navigation.navigate("SignedOut"));
  }

  addTeam = (teamDocument) => {
    currentTeams = this.state.teams;
    currentTeams.push(teamDocument);
    this.setState({ teams: currentTeams });
  }

  getTeamsForUser = (user) => {
    let _this = this;
    getUsers().doc(user.uid).get().then(function (doc) {
      _this.snapshotUser(doc);
    }).catch(function (error) {
      console.log("Error getting user profile:", error);
    });
  }

  componentDidMount() {
    this.signInUnsubscriber = hookIntoUserSignin(this.getTeamsForUser, this.signOutAndRedirect);
  }

  componentWillUnmount() {
    if (this.signInUnsubscriber) { this.signInUnsubscriber(); }

    if(this.onSnapshotUnsubscriber)
    {   this.onSnapshotUnsubscriber();}
  }

  snapshotUser = (userDocument) => {
    let _this = this;
    this.onSnapshotUnsubscriber = userDocument.ref.onSnapshot(function (doc) {
      if (doc.exists) {
        _this.setState({ user: doc, teams: [] });
        doc.data().teams.map((teamIdentifier) => getTeams().doc(teamIdentifier).get().then(_this.addTeam));
      } else {
        console.log("Signed up user does not have a profile for user id: " + userDocument.id);
      }
    });
  }

  closeTeamModal = () => {
    this.setState({ teamModalVisible: false, modalConfirm: () => { } });
  }

  showCreateTeam = () => {
    this.setState({ teamModalVisible: true, modalConfirm: this.createTeam });
  }

  showJoinTeam = () => {
    this.setState({ teamModalVisible: true, modalConfirm: this.joinTeam });
  }

  addTeamToUser = (id) => 
  {
    let teams = this.state.user.data().teams;
    if (teams.indexOf(id) == -1) 
    {
      teams.push(id);
      this.state.user.ref.update({
          teams: teams
      });
    } else {
      alert("Trying to join a team of which you are already a member");
    }
  }

  createTeam = (teamName, teamCode) => {
    getTeams().where("name", "==", teamName).where("code", "==", teamCode).get().then(
      (querySnapshot) => {
        if (querySnapshot.docs.length == 0) {
          getTeams().add({
            name: teamName,
            code: teamCode
          }).then((teamDocumentReference) => {
            this.addTeamToUser(teamDocumentReference.id);
          });
        } else {
          alert ("Cannot create team with name: " + teamName + ". It already exists with that code.")
        }
      }
    )
  }

  joinTeam = (teamName, teamCode) => 
  {
    let joined = false;
    let teamsFound = false;
    getTeams().where("name", "==", teamName).get().then((result) =>
    {
        result.forEach((doc) => 
        {
          teamsFound = true;
          if (doc.data().code == teamCode) 
          {
            this.addTeamToUser(doc.id);
            joined = true;
          }
        })
        if (!teamsFound) 
        {
          alert('No team with name: ' + teamName + ' was found');
        } 
        else
         {
          if (!joined) 
          {
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
        <View style={{ flexDirection: 'row', paddingTop: 20, paddingHorizontal: 15, justifyContent: 'space-between' }}>
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                  backgroundColor="#03A9F4"
                  onPress={() => {
                    this.props.navigation.navigate(SCREEN_NAME_STORY_BOARD, { teamId: teamDocument.id })
                  }
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
}*/
