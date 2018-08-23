import React, { Component } from "react";
import { View, ToastAndroid, Keyboard} from "react-native";
import ListTeams from "../lists/teams/ListTeams";
import {SCREEN_NAME_STORY_BOARD} from "../routing/Router";
import { getUsers, getTeams, hookIntoUserSignin, signOut } from '../firebase/FirebaseAdapter';
import DialogPreferenceText from "../dialogs/preferences/DialogPreferenceText";
import DialogTeamJoin from "../dialogs/teams/DialogTeamJoin";
import DialogConfirmation from "../dialogs/instances/DialogConfirmation";
import DialogTeamCreate from "../dialogs/teams/DialogTeamCreate";
import { FABGroup } from "react-native-paper";
import { NavigationEvents } from 'react-navigation';
import {ACTION_LEAVE_TEAM, ACTION_INSPECT_TEAM, ACTION_RENAME_TEAM, ACTION_DELETE_TEAM} from "../lists/teams/ListItemTeam"; 
import { DIALOG_ACTION_OK } from "../dialogs/instances/DialogConfirmation";
const ACTION_JOIN_TEAM = "join_team";
const ACTION_CREATE_TEAM = "create_team";

export default class ScreenTeams extends Component
{
  constructor(props)
  {
    super(props)

    this.state =
    {
      user: null,
      teams: [],
      open: false
    } 

    this.unsubscribers = [];
    this.teamUnsubscribers = [];
  }

  componentWillMount()
  {
    var unsubscriber = hookIntoUserSignin(this.onUserAvailableWhileMounting, this.onUserUnavailableWhileMounting);
    this.unsubscribers.push(unsubscriber);

    unsubscriber = this.props.navigation.addListener('willFocus', (payload) => {this.setState({shouldFabGroupRender: true})});
    this.unsubscribers.push(unsubscriber);

    unsubscriber = this.props.navigation.addListener('willBlur', (payload) => {this.setState({shouldFabGroupRender: false})});
    this.unsubscribers.push(unsubscriber);

    unsubscriber = Keyboard.addListener('keyboardDidShow', () => {this.setState({shouldFabGroupRender: false})});
    this.unsubscribers.push(unsubscriber);

    unsubscriber = Keyboard.addListener("keyboardDidHide", () => {this.setState({shouldFabGroupRender: true})});
    this.unsubscribers.push(unsubscriber);
  } 
  

  onUserUnavailableWhileMounting = () =>
  {   signOut();}

  onUserAvailableWhileMounting = (user) =>
  {
    getUsers().doc(user.uid).get().then(doc =>
    {
      //Subscribe to updates on the user document.
      const unsubscriber = doc.ref.onSnapshot(this.onUserDocumentChanged);
      this.unsubscribers.push(unsubscriber);

      //Call the first document change manually, to trigger team change subscriptions and insertion into the state.
      this.onUserDocumentChanged(doc);
    })
    .catch(function (error)
    {
      console.log("Error getting user profile:", error);
    });
  }

  onUserDocumentChanged = (document) =>
  {
    if (document.exists == false) 
    {
      signOut();
      return;
    }

    //document.ref.update({teams: []});
    //return;

    const teamsCollection = getTeams();
    this.setState({ user: document});

    this.teamUnsubscribers = [];

    //For each of the user's teams
    document.data().teams.map((teamId) => 
    { 
      //Fetch the team.
      teamsCollection.doc(teamId).get().then((team) =>
      {
        //Subscribe to the updates on the team document.
        const unsubscriber = team.ref.onSnapshot(this.onTeamDocumentChanged);
        this.teamUnsubscribers.push(unsubscriber);

        //Call the first document change manually, to trigger the insertion into the state.
        this.onTeamDocumentChanged(team);
      });
    });
  }

  onTeamDocumentChanged = (team) =>
  {
    var teams = this.state.teams;
    const index = this.getIndexOfTeamById(this.state.teams.map(current => {return current.id}), team.id);

    if(team.exists == false)
    {
      teams.splice(index, 1);
      this.state.user.ref.update({teams: teams.map(current => {return current.id})});
      return;
    }

    //Determine whether to replace or push the team.
    if(index > -1)
    {   teams.splice(index, 1, team);}
    else
    {   teams.push(team);}

    this.setState({teams: teams});
  }


  componentWillUnmount()
  {
    for (var i = 0; i < this.unsubscribers.length; i++)
    {   this.unsubscribers[i]();}

    for(var i = 0 ; i < this.teamUnsubscribers.length; i++)
    {   this.teamUnsubscribers[i]();}
  }

  onItemSelected = (item, index) => 
  {   this.props.navigation.navigate(SCREEN_NAME_STORY_BOARD, { team: item });}

  onContextMenuItemSelected = (item, index, action) =>
  {
    switch (action) 
    {
      case ACTION_LEAVE_TEAM:
        if(this.dialogConfirmLeave)
        {
          this.currentlyLeavingTeam = item;
          this.dialogConfirmLeave.setVisible(true);
        }
        break;

      case ACTION_RENAME_TEAM:
        if (this.dialogRename) 
        {
          this.currentlyRenamingTeam = item;
          this.dialogRename.onValueChange(item.data().name);
          this.dialogRename.setVisible(true);
        }
        break;

      case ACTION_INSPECT_TEAM:
        this.onItemSelected(item, index);
        break;

      case ACTION_DELETE_TEAM:
        item.ref.delete().then(() => 
        {
            ToastAndroid.show("Team successfully deleted!", ToastAndroid.LONG);
        })
        .catch(error => 
        {
          ToastAndroid.show("Team could not be deleted, please try again.", ToastAndroid.LONG);
        });
        break;
    } 
  }

  onFabMenuItemSelected = (action) =>
  {
    switch(action)
    {
      case ACTION_JOIN_TEAM:
        if(this.dialogJoinTeam)
        {   this.dialogJoinTeam.setVisible(true);}
        break;

      case ACTION_CREATE_TEAM:
        if(this.dialogCreateTeam)
        {   this.dialogCreateTeam.setVisible(true);}
        break;
    }
  }
 
  onRenameDialogSubmitted = (value) => 
  {
    //Update the team name in the firstore database.
    this.currentlyRenamingTeam.ref.update({name: value});
  }  

  onJoinDialogSubmitted = (name, code) => 
  {
    //console.log("Name: " + name + " AND Code: " + code);
    getTeams().where("name", "==", name.toString()).get().then(teams => 
    {
      //console.log("FOUND 1: " + teams.docs.length);
      for(var i = 0 ; i < teams.docs.length ; i ++)
      { 
        const team = teams.docs[i];
        if(team.data().code.toString() == code.toString())
        {
          var userTeams = this.state.user.data().teams;
          if(userTeams.indexOf(team.id) > -1)
          {   continue;}

          userTeams.push(team.id);
          this.state.user.ref.update({teams: userTeams});

          return;
        }
      }

      if(teams.docs.length <= 0)
      {   alert("No team called '" + name + "' could be found.");}
      else
      {   alert("A team called '" + name + "' could be found, but the security code was incorrect.")}
    });
  }

  onCreateDialogSubmitted = (team) =>
  {
    //console.log("TEAM: " + JSON.stringify(team));
    getTeams().add(team).then((doc) =>
    {   
        ToastAndroid.show("Team successfully created!", ToastAndroid.LONG);
        const teams = this.state.user.data().teams;
        teams.push(doc.id);
        this.state.user.ref.update({teams: teams});
    })
    .catch(error => 
    {   ToastAndroid.show("Team could not be created, please try again.", ToastAndroid.LONG)});
  }
 
  onLeaveDialogActionPressed = (action) =>
  {
    switch(action)
    {
      case DIALOG_ACTION_OK:
        const item = this.currentlyLeavingTeam;
        var userTeams =  this.state.user.data().teams;
        var index = this.getIndexOfTeamById(userTeams, item.id);

        if(index > -1)
        {
          //Remove the team from the user document.
          userTeams.splice(index, 1);
          this.state.user.ref.update({ teams: userTeams });

          //Remove the team document from the state.
          var teamDocs = this.state.teams;
          teamDocs.splice(index, 1);
          this.setState({teams: teamDocs});
        }
        break;
    }
  }

  render() {
    return (  
      <View>  
        <ListTeams items={this.state.teams} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
        <DialogPreferenceText ref={instance => this.dialogRename = instance} visible={false} label="Team Name" storageValue="" onDialogSubmitted={this.onRenameDialogSubmitted} />
        <DialogTeamJoin title="Join Team" ref={instance => this.dialogJoinTeam = instance} visible={false} onDialogSubmitted={this.onJoinDialogSubmitted} />
        <DialogTeamCreate title="Create Team" ref={instance => this.dialogCreateTeam = instance} visible={false} onDialogSubmitted={this.onCreateDialogSubmitted} />
        <DialogConfirmation title="Confirmation" ref={instance => this.dialogConfirmLeave = instance}  visible={false} message="Are you sure you want to leave this team?" onDialogActionPressed={this.onLeaveDialogActionPressed} />
        {this.state.shouldFabGroupRender && <FABGroup ref={instance => this.fabGroup = instance} color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open) => this.setState(open)} />}
      </View>
    );
  }



  getFabGroupActions = () => 
  {
    var actions = [];
    actions.push({ icon: "add", label: "Create Team", onPress: () => this.onFabMenuItemSelected(ACTION_CREATE_TEAM) })
    actions.push({ icon: "device-hub", label: "Join Team", onPress: () => {this.onFabMenuItemSelected(ACTION_JOIN_TEAM)} })

    return actions;
  }

  getIndexOfTeamById = (teamIds, id) =>
  {
    for (var i = 0; i < teamIds.length; i++)
    {
      const current = teamIds[i];
      if (current == id)
      {   return i;}
    }

    return -1;
  }
}
