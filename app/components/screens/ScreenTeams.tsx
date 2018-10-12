import React, { Component } from "react";
import { View} from "react-native";
import {STACK_NAME_STORY_BOARD, SCREEN_NAME_TEAM_EDIT, SCREEN_NAME_STORY_BOARD_DOING, PARAM_NAME_SUBTITLE} from "../routing/Router";
import { FAB } from "react-native-paper";
import ActionType from "../../enums/ActionType";
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import WithDialogContainer, { WithDialogContainerProps } from "../../hocs/WithDialogContainer";
import { ReduxState } from "../../redux/ReduxState";
import ReduxUser from "../../dtos/redux/ReduxUser";
import { Dispatch } from "redux";
import ActionStartInspectTeam from "../../redux/actions/inspection/ActionStartInspectTeam";
import WithLoading, { WithLoadingProps } from "../../hocs/WithLoading";
import ReduxTeam from "../../dtos/redux/ReduxTeam";
import { HiEfficiencyNavigator } from "../routing/RoutingTypes";
import DialogConfirmation, { ConcreteDialogConfirmation, DialogConfirmationActionUnion } from "../dialog/instances/DialogConfirmation";
import UtilityIndexable from "../../utilities/UtilityIndexable";
import ListTeams from "../list/instances/teams/ListTeams";
import FabAction from "../../dtos/options/FabAction";
import WithReduxSubscription from "../../hocs/WithReduxSubscription";
import DialogPreferenceTextMulti, { TextElement, DialogPreferenceTextMulti_StorageValue } from "../dialog/preferences/DialogPreferenceTextMulti";
import ActionOption from "../../dtos/options/ActionOption";


interface ReduxStateProps 
{
  user: ReduxUser
}

interface ReduxDispatchProps
{
  onInspectTeamStart: (teamId: string) => ActionStartInspectTeam
}

const mapStateToProps = (state: ReduxState): ReduxStateProps =>
{
  return {
    user: state.user!
  }
}

const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatchProps =>
{
  return {
    onInspectTeamStart: (teamId: string) => dispatch(new ActionStartInspectTeam(teamId))
  }
}

type Props = ReduxStateProps & WithDatabaseProps & WithLoadingProps & WithDialogContainerProps &
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

  private dialogConfirmLeave?: ConcreteDialogConfirmation;
  private dialogConfirmDelete?: ConcreteDialogConfirmation;
  private dialogJoinTeam: DialogPreferenceTextMulti<JoinTeamStorageValue> | null = null;

  private currentlyDeletingTeam?: ReduxTeam;
  private currentlyLeavingTeam?: ReduxTeam;

  constructor(props: Props)
  {
    super(props)

    this.state =
    {
      user: this.props.user,
      open: false,
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
    this.props.navigation.navigate(STACK_NAME_STORY_BOARD, { team: item.document, [PARAM_NAME_SUBTITLE]: item.document.data.name});
    this.props.navigation.navigate(SCREEN_NAME_STORY_BOARD_DOING);
  }

  onContextMenuItemSelected = (item: ReduxTeam, _index: number, action: ActionOption) =>
  {
    switch (action.id) 
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
        this.props.navigation.navigate(SCREEN_NAME_TEAM_EDIT, {team: item.document});
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

      case ActionType.CREATE:
        this.props.navigation.navigate(SCREEN_NAME_TEAM_EDIT, {title: "Create Team"});
    }
  }
 
  onJoinDialogSubmitted = (storageValue: DialogPreferenceTextMulti_StorageValue | null) => 
  {   
    if(storageValue == null)
    { return;}
    
    this.props.database.inDialog("dialog-joining-team", this.props.addDialog, this.props.removeDialog, "Joining Team", async (execute) => 
    {
      const join = this.props.database.joinTeam(storageValue.name!, storageValue.code!, this.props.user.document.id!, this.props.user.document.data.teams);
      await execute(join, false);
    });
  }
 
  onLeaveDialogActionPressed = (_concreteComponent: ConcreteDialogConfirmation | undefined, action: DialogConfirmationActionUnion) =>
  {
    switch(action)
    {
      case "Positive":
        this.props.database.inDialog("dialog-leaving-team", this.props.addDialog, this.props.removeDialog, "Leaving Team", async (execute) => 
        {
          const leave = this.props.database.leaveTeam(this.currentlyLeavingTeam!.document.id!, this.state.user.document.id!, this.state.user.document.data.teams);
          await execute(leave, false);
        });
        break;
    }
  }

  onDeleteDialogActionPressed = (_concreteComponent: ConcreteDialogConfirmation | undefined, action: DialogConfirmationActionUnion) =>
  {
    switch(action)
    {
      case "Positive":
        this.props.database.inDialog("dialog-deleting-team", this.props.addDialog, this.props.removeDialog, "Deleting Team", async (execute) => 
        {
          const del = this.props.database.deleteTeam(this.currentlyDeletingTeam!.document.id!, this.props.user.document.id!, this.props.user.document.data.teams);
          await execute(del, false);
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
        <ListTeams containerHasFab={true} items={UtilityIndexable.toArray(this.state.user.teams)} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
        <DialogPreferenceTextMulti<JoinTeamStorageValue> storageValue={null} title="Join Team" onSubmit={this.onJoinDialogSubmitted} ref={instance => this.dialogJoinTeam = instance} elements={[new TextElement("name", "Name", true), new TextElement("code", "Security Code", true)]} />
        <DialogConfirmation title="Confirmation" concreteRef={i => this.dialogConfirmLeave = i}   visible={false} message="Are you sure you want to leave this team?" onActionClickListener={this.onLeaveDialogActionPressed} />
        <DialogConfirmation title="Deleting Team" concreteRef={i => this.dialogConfirmDelete = i} visible={false} message="Are you sure you want to delete this team? This cannot be undone and will delete all data, including stories and interruptions!" onActionClickListener={this.onDeleteDialogActionPressed} textPositive={"Delete"} textNegative={"No, Cancel!"} />

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
const hoc1 = WithReduxSubscription<ScreenTeams, ScreenTeams, Props, ReduxStateProps, ReduxDispatchProps>(mapStateToProps, mapDispatchToProps)(ScreenTeams);
const hoc2 = WithDatabase(hoc1);
const hoc3 = WithDialogContainer(hoc2);
const hoc4 = WithLoading(hoc3);

export default hoc4;