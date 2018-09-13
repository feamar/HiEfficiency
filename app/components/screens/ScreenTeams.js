import React, { Component } from "react";
import { View, ToastAndroid} from "react-native";
import ListTeams from "../lists/instances/teams/ListTeams";
import {STACK_NAME_STORY_BOARD, SCREEN_NAME_TEAM_EDIT} from "../routing/Router";
import DialogTeamJoin from "../dialogs/teams/DialogTeamJoin";
import DialogConfirmation from "../dialogs/instances/DialogConfirmation";
import DialogTeamCreate from "../dialogs/teams/DialogTeamCreate";
import { FAB } from "react-native-paper";
import ActionType from "../../enums/ActionType";
import WithReduxListener from "../../hocs/WithReduxListener";
import update from 'immutability-helper';
import * as ReducerInspecting from "../../redux/reducers/ReducerInspecting"
import UtilityObject from "../../utilities/UtilityObject";
import WithDatabase from "../../hocs/WithDatabase";
import ResolveType from "../../enums/ResolveType";
import FirestoreFacade from "../firebase/FirestoreFacade";


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
      user: this.props.user,
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
    const items = keys.map((key, index) => {return teams[key]});

    return items;
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

        if(this.dialogConfirmDelete)
        {
          this.currentlyDeletingTeam = item;
          this.dialogConfirmDelete.setVisible(true); 
        }
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
  {   this.props.database.joinTeam(name, code, this.props.user.data.teams, this.props.user.uid, ResolveType.NONE, ResolveType.TOAST);}

  onCreateDialogSubmitted = (team) =>
  {
      this.props.database.createTeam(team.name, team.code, this.props.user.data.teams, this.props.user.uid, ResolveType.TOAST, ResolveType.TOAST);
  }
 
  onLeaveDialogActionPressed = (action) =>
  {
    switch(action)
    {
      case ActionType.POSITIVE:
        this.props.database.leaveTeam(this.currentlyLeavingTeam.id, this.state.user.data.teams, this.state.user.uid, ResolveType.TOAST, ResolveType.TOAST);
        break;
    }
  }

  onDeleteDialogActionPressed = (action) =>
  {
    switch(action)
    {
      case ActionType.POSITIVE:
        this.props.database.deleteTeam(this.currentlyDeletingTeam.id, ResolveType.TOAST, ResolveType.TOAST);
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
        <DialogConfirmation title="Deleting Team" ref={instance => this.dialogConfirmDelete = instance}  visible={false} message="Are you sure you want to delete this team? This cannot be undone and will delete all data, including stories and interruptions!" onDialogActionPressed={this.onDeleteDialogActionPressed} textPositive={"Delete"} textNegative={"No, Cancel!"} />
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

export default WithReduxListener(mapStateToProps, mapDispatchToProps, WithDatabase(ScreenTeams));