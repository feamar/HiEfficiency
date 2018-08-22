import React, { Component } from "react";
import { View } from "react-native";
import ListTeams from "../lists/teams/ListTeams";
import { ACTION_LEAVE, ACTION_RENAME, ACTION_INSPECT } from "../lists/teams/ListItemTeam";

import { SCREEN_NAME_STORY_BOARD } from '../routing/Router';

import { getUsers, getTeams, hookIntoUserSignin, signOut } from '../firebase/FirebaseAdapter';
import DialogPreferenceText from "../dialogs/preferences/DialogPreferenceText";
import DialogJoinTeam from "../dialogs/teams/DialogJoinTeam";
import { FABGroup } from "react-native-paper";

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

  componentWillMount() {
    const unsubscriber = hookIntoUserSignin(this.onUserAvailableWhileMounting, this.onUserUnavailableWhileMounting);
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
    console.log("onUserDocumentChanged(" + document + ")");
    if (document.exists == false) 
    {
      console.log("Signed up user does not have a profile for user id: " + document.id);
      signOut();
      return;
    }

    const teamsCollection = getTeams();
    this.setState({ user: document, teams: []});

    this.teamUnsubscribers = [];

    //For each of the user's teams
    document.data().teams.map((teamId) => 
    { 
      console.log("TEAM ID: " + JSON.stringify(teamId)) ;
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

    //console.log("onTeamDocumentChanged(" + JSON.stringify(JSON.decycle(team)) +")"); 
     
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
  {   this.props.navigation.navigate(SCREEN_NAME_STORY_BOARD, { teamId: item.id });}

  onContextMenuItemSelected = (item, index, action) => 
  {
    console.log("onContextMenuItemSelected(" + item + ", " + index + ", " + action + ")");
    switch (action) 
    {
      case ACTION_LEAVE:
        var teams =  this.state.user.data().teams;
        let index = this.getIndexOfTeamById(teams, item.id);
        if(index > -1)
        {
          teams.splice(index, 1);
          this.state.user.ref.update({ teams: teams });
        }
        
        break;

      case ACTION_RENAME:
        if (this.dialogRename) 
        {
          this.currentlyRenamingTeam = item;
          this.dialogRename.setValue(item.data().name);
          this.dialogRename.base.handleOpen();
        }
        break;

      case ACTION_INSPECT:
        this.onItemSelected(item, index);
        break;
    } 
  }
 
  onRenameDialogSubmitted = (value) => 
  {
    console.log("onRenameDialogSubmitted(" + value + ")");
    //Update the team name in the firstore database.
    this.currentlyRenamingTeam.ref.update({name: value});
  }

  onJoinDialogSubmitted = (name, securityCode) => 
  {
    console.log("onJoinDialogSubmitted(" + name + ", " + securityCode + ")");
    getTeams().where("name", "==", name).get().then(teams => 
    {
      for(var i = 0 ; i < teams.docs.length ; i ++)
      {
        const team = teams.docs[i];
        if(team.data().code == securityCode)
        {
          var userTeams = this.state.user.data().teams; 
          if(userTeams.indexOf(team.id) > -1)
          {   continue;}

          userTeams.push(team.id); 
          this.state.user.ref.update({teams: userTeams});

          return;
        }
      }

      if(teams.length <= 0)
      {   alert("No team called '" + name + "' could be found.");}
      else
      {   alert("A team called '" + name + "' could be found, but the security code was incorrect.")}
    });
  }

  handleCreateNewTeam = () => 
  {   }

  render() {
    console.log("RENDER");
    return (
      <View>
        <ListTeams items={this.state.teams} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
        <DialogPreferenceText ref={instance => this.dialogRename = instance} visible={false} label="Team Name" value="" onDialogSubmitted={this.onRenameDialogSubmitted} />
        <DialogJoinTeam ref={instance => this.dialogJoinTeam = instance} visible={false} onDialogSubmitted={this.onJoinDialogSubmitted} />
        <FABGroup ref={instance => this.fabGroup = instance} color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open) => this.setState(open)} />
      </View>
    );
  }

  getFabGroupActions = () => 
  {
    var actions = [];
    actions.push({ icon: "add", label: "Create Team", onPress: this.handleCreateNewTeam })
    actions.push({ icon: "device-hub", label: "Join Team", onPress: () => {this.dialogJoinTeam.handleOpen()} })

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
