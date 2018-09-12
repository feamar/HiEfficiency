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
import WithReduxListener from "../../hocs/WithReduxListener";
import update from 'immutability-helper';
import * as ReducerInspecting from "../../redux/reducers/ReducerInspecting"


const mapStateToProps = (state, props) =>
{
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, props) =>
{
  return {
    onInspectTeamStart: (teamId) => dispatch(ReducerInspecting.onInspectTeamStart(teamId)),
  }
}

class ScreenTeams extends Component
{
  static displayName = "Screen Teams";

  constructor(props)
  {
    super(props)

    this.state =
    {
      user: null,
      open: false,
      shouldFabGroupRender: true,
      teamListItems: this.getTeamListItems(this.props.user.teams)
    } 

    this.setLoading(this.props);
  }

  onReduxStateChanged = (props) =>
  {
    if(this.state.user != props.user)
    { 
      this.setState({user: props.user, teamListItems: this.getTeamListItems(props.user.teams)});
      this.setLoading(props);
    }
  }

  getTeamListItems = (teams) =>
  {
    const keys = Object.keys(teams);
    return keys.map((key, index) => {return teams[key]});
  }
  
  setLoading = (props) =>
  {   this.props.setLoading(props.user == undefined || props.user.teams == undefined && props.user.loaded == false);}

  setFabVisibility = (visible) =>
  {   this.setState({shouldFabGroupRender: visible});}

  onItemSelected = (item, index) => 
  { 
    this.props.navigation.navigate(STACK_NAME_STORY_BOARD, { team: item});
  }

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
        FirebaseAdapter.getTeams().doc(item.id).delete().then(() => 
        {   ToastAndroid.show("Team successfully deleted!", ToastAndroid.LONG);}) 
        .catch(error => 
        {   ToastAndroid.show("Team could not be deleted, please try again.", ToastAndroid.LONG);});
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
 
  onJoinDialogSubmitted = (name, code) => 
  {
    FirebaseAdapter.getTeams().where("name", "==", name.toString()).get().then(teams => 
    {
      for(var i = 0 ; i < teams.docs.length ; i ++)
      { 
        const team = teams.docs[i];
        if(team.data().code.toString() == code.toString())
        {
          var newData = this.state.user.data.teams;
          if(newData.indexOf(team.id) > -1)
          {   continue;}

          newData = update(newData, {$push: [team.id]});
          FirebaseAdapter.getUsers().doc(this.state.user.uid).update({teams: newData});

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
    FirebaseAdapter.getTeams().add(team).then((doc) =>
    {   
        ToastAndroid.show("Team successfully created!", ToastAndroid.LONG);
        const teams = update(this.state.user.data.teams, {$push: [doc.id]});
        FirebaseAdapter.getUsers().doc(this.state.user.uid).update({teams: teams});
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
        var userTeams =  this.state.user.data.teams;
        var index = this.getIndexOfTeamById(userTeams, item.id);

        if(index > -1)
        {
          //Remove the team from the user document.
          userTeams = update(userTeams, {$splice: [[index, 1]]})
          FirebaseAdapter.getUsers().doc(this.state.user.uid).update({ teams: userTeams });
        }
        break;
    }
  }

  render() 
  {
    if(this.state.user == undefined || this.state.user.teams == undefined)
    {   return null;}


    return (  
      <View style={{height: "100%"}}>  
        <ListTeams containerHasFab={true} items={this.state.teamListItems} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
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


export default WithReduxListener(mapStateToProps, mapDispatchToProps, ScreenTeams);