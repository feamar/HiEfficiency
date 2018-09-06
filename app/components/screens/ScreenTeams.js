import React, { Component } from "react";
import { View, ToastAndroid, Keyboard} from "react-native";
import ListTeams from "../lists/instances/teams/ListTeams";
import {STACK_NAME_STORY_BOARD, SCREEN_NAME_TEAM_EDIT} from "../routing/Router";
import FirebaseAdapter from '../firebase/FirebaseAdapter';
import DialogPreferenceText from "../dialogs/preferences/DialogPreferenceText";
import DialogTeamJoin from "../dialogs/teams/DialogTeamJoin";
import DialogConfirmation from "../dialogs/instances/DialogConfirmation";
import DialogTeamCreate from "../dialogs/teams/DialogTeamCreate";
import { FAB } from "react-native-paper";
import { NavigationEvents } from 'react-navigation';
import UtilityScreen from "../../utilities/UtilityScreen";
import withFloatingActionButton from "../../hocs/WithFloatingActionButton";
import ActionType from "../../enums/ActionType";
import { Item } from "native-base";
import ListItemTeam from "../lists/instances/teams/ListItemTeam";
import AbstractList from "../lists/abstractions/list/AbstractList";

class ScreenTeams extends Component
{
  constructor(props)
  {
    super(props)

    this.state =
    {
      user: null,
      teams: [],
      open: false,
      shouldFabGroupRender: true
    } 

    this.teamUnsubscribers = [];
    this.unsubscribers = [];
  }

  componentWillMount()
  {
    var unsubscriber = FirebaseAdapter.getCurrentUser(this.onUserAvailableWhileMounting, this.onUserUnavailableWhileMounting);
    this.unsubscribers.push(unsubscriber);
  } 
  
  componentWillUnmount()
  {
    for (var i = 0; i < this.unsubscribers.length; i++)
    {   this.unsubscribers[i]();}

    for(var i = 0 ; i < this.teamUnsubscribers.length; i++)
    {   this.teamUnsubscribers[i]();}
  }
 
  setFabVisibility = (visible) =>
  {   this.setState({shouldFabGroupRender: visible});}

  onUserUnavailableWhileMounting = () =>
  {   FirebaseAdapter.logout();}

  onUserAvailableWhileMounting = (user) =>
  {
    FirebaseAdapter.getUsers().doc(user.uid).get().then(doc =>
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
      FirebaseAdapter.logout();
      return;
    }

    const teamsCollection = FirebaseAdapter.getTeams();
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


  onItemSelected = (item, index) => 
  {   this.props.navigation.navigate(STACK_NAME_STORY_BOARD, { team: item});}

  onContextMenuItemSelected = (item, index, action) =>
  {
    switch (action) 
    {
      case ActionType.LEAVE:
        if(this.dialogConfirmLeave)
        {
          this.currentlyLeavingTeam = item; 
          this.dialogConfirmLeave.setVisible(true);
        }
        break;
 
      case ActionType.INSPECT:
        this.onItemSelected(item, index);
        break;
 
      case ActionType.DELETE:
        item.ref.delete().then(() => 
        {
            ToastAndroid.show("Team successfully deleted!", ToastAndroid.LONG);
        }) 
        .catch(error => 
        {
          ToastAndroid.show("Team could not be deleted, please try again.", ToastAndroid.LONG);
        });
        break;

      case ActionType.EDIT:
        this.props.navigation.navigate(SCREEN_NAME_TEAM_EDIT, {team: item});
        break;
    } 
  }

  onFabMenuItemSelected = (action) =>
  {
    switch(action)
    {
      case ActionType.JOIN:
        if(this.dialogJoinTeam)
        {   this.dialogJoinTeam.setVisible(true);}
        break;

      case ActionType.CREATE:
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
    FirebaseAdapter.getTeams().where("name", "==", name.toString()).get().then(teams => 
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
    FirebaseAdapter.getTeams().add(team).then((doc) =>
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
      case ActionType.POSITIVE:
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
      <View style={{height: "100%"}}>  
        <ListTeams containerHasFab={true} items={this.state.teams} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
        <DialogTeamJoin title="Join Team" ref={instance => this.dialogJoinTeam = instance} visible={false} onDialogSubmitted={this.onJoinDialogSubmitted} />
        <DialogTeamCreate title="Create Team" ref={instance => this.dialogCreateTeam = instance} visible={false} onDialogSubmitted={this.onCreateDialogSubmitted} />
        <DialogConfirmation title="Confirmation" ref={instance => this.dialogConfirmLeave = instance}  visible={false} message="Are you sure you want to leave this team?" onDialogActionPressed={this.onLeaveDialogActionPressed} />
        {this.state.shouldFabGroupRender && <FAB.Group ref={instance => this.fabGroup = instance} color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open) => this.setState(open)} />}
      </View>
    );
  }



  getFabGroupActions = () => 
  {
    var actions = [];
    actions.push({ icon: "add", label: "Create Team", onPress: () => this.onFabMenuItemSelected(ActionType.CREATE) })
    actions.push({ icon: "device-hub", label: "Join Team", onPress: () => {this.onFabMenuItemSelected(ActionType.JOIN)} })

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


export default ScreenTeams;