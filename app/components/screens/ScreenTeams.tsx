import React, { Component } from "react";
import { View, ToastAndroid} from "react-native";
import ListTeams from "../lists/instances/teams/ListTeams";
import {STACK_NAME_STORY_BOARD, SCREEN_NAME_TEAM_EDIT, SCREEN_NAME_STORY_BOARD_DOING, PARAM_NAME_SUBTITLE} from "../routing/Router";
import DialogConfirmation from "../dialogs/instances/DialogConfirmation";
import { FAB } from "react-native-paper";
import ActionType from "../../enums/ActionType";
import WithReduxListener from "../../hocs/WithReduxListener";
import update from 'immutability-helper';
import * as ReducerInspecting from "../../redux/reducers/ReducerInspecting"
import UtilityObject from "../../utilities/UtilityObject";
import WithDatabase from "../../hocs/WithDatabase";
import ResolveType from "../../enums/ResolveType";
import FirestoreFacade from "../firebase/FirestoreFacade";
import DialogLoading from "../dialogs/instances/DialogLoading";
import WithDialogContainer from "../../hocs/WithDialogContainer";
import FirebaseAdapter from "../firebase/FirebaseAdapter";
import DialogPreferenceTextMulti, {TextElement} from "../dialogs/preferences/DialogPreferenceTextMulti";

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
    this.props.navigation.navigate(STACK_NAME_STORY_BOARD, { team: item, [PARAM_NAME_SUBTITLE]: item.data.name});
    this.props.navigation.navigate(SCREEN_NAME_STORY_BOARD_DOING);
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
 
  onJoinDialogSubmitted = async (team) => 
  {   
    await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Joining Team", async (execute) => 
    {
      const join = this.props.database.joinTeam(team.name, team.code, this.props.user.data.teams, this.props.user.uid);
      await execute(join);
    });
  }

  onCreateDialogSubmitted = async (team) =>
  {   
    await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Creating Team", async (execute) => 
    {
      const create = this.props.database.createTeam(team.name, team.code, this.props.user.data.teams, this.props.user.uid);
      await execute(create);
    });
  }
 
  onLeaveDialogActionPressed = async (action) =>
  {
    switch(action)
    {
      case ActionType.POSITIVE:
        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Leaving Team", async (execute) => 
        {
          const leave = this.props.database.leaveTeam(this.currentlyLeavingTeam.id, this.state.user.data.teams, this.state.user.uid);
          await execute(leave);
        });
        break;
    }
  }

  onDeleteDialogActionPressed = async (action) =>
  {
    switch(action)
    {
      case ActionType.POSITIVE:
        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Leaving Team", async (execute) => 
        {
          const del = this.props.database.deleteTeam(this.currentlyDeletingTeam.id, this.props.user.data.teams, this.props.user.uid);
          await execute(del);
        });
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
        <DialogPreferenceTextMulti title="Join Team" onDialogSubmitted={this.onJoinDialogSubmitted} ref={instance => this.dialogJoinTeam = instance} elements={[new TextElement("name", "Name", true), new TextElement("code", "Security Code", true)]} />
        <DialogPreferenceTextMulti title="Create Team" onDialogSubmitted={this.onCreateDialogSubmitted}  ref={instance => this.dialogCreateTeam = instance} elements={[new TextElement("name", "Name", true), new TextElement("code", "Security Code", true)]}  />
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

const hoc1 = WithDatabase(ScreenTeams);
const hoc2 = WithDialogContainer(hoc1);
const hoc3 = WithReduxListener(mapStateToProps, mapDispatchToProps, hoc2);

export default hoc3;