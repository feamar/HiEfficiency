import React, { Component } from "react";
import { View} from "react-native";
import {STACK_NAME_STORY_BOARD, SCREEN_NAME_TEAM_EDIT, SCREEN_NAME_STORY_BOARD_DOING, PARAM_NAME_SUBTITLE} from "../routing/Router";
import DialogConfirmation from "../dialogs/instances/DialogConfirmation";
import { FAB } from "react-native-paper";
import ActionType from "../../enums/ActionType";
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import WithDialogContainer, { WithDialogContainerProps } from "../../hocs/WithDialogContainer";
import { ReduxState } from "../../redux/ReduxState";
import ReduxUser from "../../dtos/redux/ReduxUser";
import { Dispatch } from "redux";
import ActionStartInspectTeam from "../../redux/actions/inspection/ActionStartInspectTeam";
import { WithLoadingProps } from "../../hocs/WithLoading";
import ReduxTeam from "../../dtos/redux/ReduxTeam";
import { HiEfficiencyNavigator } from "../routing/RoutingTypes";
import { ConcreteDialogConfirmation } from "../dialog/instances/DialogConfirmation";
import DialogPreferenceTextMulti, { TextElement } from "../dialog/preferences/DialogPreferenceTextMulti";
import UtilityMap from "../../utilities/UtilityMap";
import ListTeams from "../list/instances/teams/ListTeams";
import FabAction from "../../dtos/options/FabAction";
import WithReduxSubscription from "../../hocs/WithReduxSubscription";


interface ReduxProps 
{
  user: ReduxUser
}

const mapStateToProps = (state: ReduxState): ReduxProps =>
{
  return {
    user: state.user!
  }
}

const mapDispatchToProps = (dispatch: Dispatch) =>
{
  return {
    onInspectTeamStart: (teamId: string) => dispatch(new ActionStartInspectTeam(teamId))
  }
}

type Props = ReduxProps & WithDatabaseProps & WithLoadingProps & WithDialogContainerProps &
{
  navigation: HiEfficiencyNavigator
}

interface State
{
  user: ReduxUser,
  open: boolean,
}

type JoinTeamStorageValue = {
  code: string,
  name: string
}

class ScreenTeams extends Component<Props, State>
{
  static displayName = "Screen Teams";

  private dialogConfirmLeave: ConcreteDialogConfirmation | null = null;
  private dialogConfirmDelete: ConcreteDialogConfirmation | null = null;
  private dialogJoinTeam: DialogPreferenceTextMulti<JoinTeamStorageValue>  | null = null;

  private currentlyDeletingTeam?: ReduxTeam;
  private currentlyLeavingTeam?: ReduxTeam;

  constructor(props: Props)
  {
    super(props)

    this.state =
    {
      user: this.props.user,
      open: false
    } 

    this.setLoading(this.props);
  }

  componentWillReceiveProps = (props: Props) =>
  {
    if(this.state.user != props.user)
    { 
      this.setState({user: props.user});
      this.setLoading(this.props);
    }
  }
  
  setLoading = (props: Props) =>
  {   this.props.setLoading(props.user == undefined || props.user.teams == undefined && props.user.loaded == false);}

  onItemSelected = (item: ReduxTeam, _index: number) => 
  { 
    this.props.navigation.navigate(STACK_NAME_STORY_BOARD, { team: item, [PARAM_NAME_SUBTITLE]: item.document.data.name});
    this.props.navigation.navigate(SCREEN_NAME_STORY_BOARD_DOING);
  }

  onContextMenuItemSelected = (item: ReduxTeam, _index: number, action: ActionType) =>
  {
    switch (action) 
    {
      case ActionType.LEAVE:
        if(this.dialogConfirmLeave)
        {
          this.currentlyLeavingTeam = item; 
          if(this.dialogConfirmLeave.base)
          {   this.dialogConfirmLeave.base.setVisible(true);}
        }
        break;
 
      case ActionType.DELETE:

        if(this.dialogConfirmDelete)
        {
          this.currentlyDeletingTeam = item;
          if(this.dialogConfirmDelete.base)
          {   this.dialogConfirmDelete.base.setVisible(true);}
        }
        break;

      case ActionType.EDIT:
        this.props.navigation.navigate(SCREEN_NAME_TEAM_EDIT, {team: item});
        break;
    } 
  }

  onFabMenuItemSelected = (action: ActionType) =>
  {
    switch(action)
    {
      case ActionType.JOIN:
        if(this.dialogJoinTeam && this.dialogJoinTeam.base && this.dialogJoinTeam.base.base)
        {   this.dialogJoinTeam.base.base.setVisible(true);}
        break;
    }
  }
 
  onJoinDialogSubmitted = async (storageValue: Map<string, string> | null) => 
  {   
    if(storageValue == null)
    { return;}
    
    await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Joining Team", async (execute) => 
    {
      const join = this.props.database.joinTeam(storageValue.get("name")!, storageValue.get("code")!, this.props.user.document.id!, this.props.user.document.data.teams);
      await execute(join);
    });
  }
 
  onLeaveDialogActionPressed = async (action: ActionType) =>
  {
    switch(action)
    {
      case ActionType.POSITIVE:
        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Leaving Team", async (execute) => 
        {
          const leave = this.props.database.leaveTeam(this.currentlyLeavingTeam!.document.id!, this.state.user.document.id!, this.state.user.document.data.teams);
          await execute(leave);
        });
        break;
    }
  }

  onDeleteDialogActionPressed = async (action: ActionType) =>
  {
    switch(action)
    {
      case ActionType.POSITIVE:
        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Leaving Team", async (execute) => 
        {
          const del = this.props.database.deleteTeam(this.currentlyDeletingTeam!.document.id!, this.props.user.document.id!, this.props.user.document.data.teams);
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
        <ListTeams containerHasFab={true} items={UtilityMap.toArray(this.state.user.teams)} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
        <DialogPreferenceTextMulti<JoinTeamStorageValue> storageValue={null} title="Join Team" onSubmit={this.onJoinDialogSubmitted} ref={instance => this.dialogJoinTeam = instance} elements={[new TextElement("name", "Name", true), new TextElement("code", "Security Code", true)]} />
        <DialogConfirmation title="Confirmation" ref={(instance: ConcreteDialogConfirmation) => this.dialogConfirmLeave = instance}  visible={false} message="Are you sure you want to leave this team?" onDialogActionPressed={this.onLeaveDialogActionPressed} />
        <DialogConfirmation title="Deleting Team" ref={(instance: ConcreteDialogConfirmation) => this.dialogConfirmDelete = instance}  visible={false} message="Are you sure you want to delete this team? This cannot be undone and will delete all data, including stories and interruptions!" onDialogActionPressed={this.onDeleteDialogActionPressed} textPositive={"Delete"} textNegative={"No, Cancel!"} />

        <FAB.Group color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open: {open: boolean}) => this.setState(open)} />
      </View>
    );
  }



  getFabGroupActions = (): Array<FabAction> => 
  {
    var actions = [];
    actions.push(new FabAction("add", "Create Team", () => this.onFabMenuItemSelected(ActionType.CREATE)));
    actions.push(new FabAction("device-hub", "Join Team", () => this.onFabMenuItemSelected(ActionType.JOIN)));

    return actions;
  }
}

const hoc1 = WithDatabase(ScreenTeams);
const hoc2 = WithDialogContainer(hoc1);
const hoc3 = WithReduxSubscription(mapStateToProps, mapDispatchToProps)(hoc2);

export default hoc3;