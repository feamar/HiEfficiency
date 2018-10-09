import React, {Component} from 'react';
import PreferenceCategory from '../preferences/PreferenceCategory';
import {View} from 'react-native';
import withBackButtonInterceptor, { WithBackButtonInterceptorProps } from "../../hocs/WithBackButtonInterceptor";
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import UtilityUpdate from '../../utilities/UtilityUpdate';
import WithDialogContainer, { WithDialogContainerProps, WithDialogContainerState } from '../../hocs/WithDialogContainer';
import { HiEfficiencyNavigator } from '../routing/RoutingTypes';
import DialogConfirmation, { ConcreteDialogConfirmation, DialogConfirmationActionUnion } from '../dialog/instances/DialogConfirmation';
import InputFloatingActionButton from "../inputs/InputFloatingActionButton";
import PreferenceDateTime from '../preferences/field/PreferenceDateTime';
import PreferenceText from '../preferences/field/PreferenceText';
import DocumentTeam from '../../dtos/firebase/firestore/documents/DocumentTeam';
import ReduxUser from '../../dtos/redux/ReduxUser';
import { ReduxState } from '../../redux/ReduxState';
import WithReduxSubscription from '../../hocs/WithReduxSubscription';
import AbstractFirestoreDocument from '../../dtos/firebase/firestore/documents/AbstractFirestoreDocument';
import { DialogPreferenceText_StorageValue } from '../dialog/preferences/DialogPreferenceText';
import { DialogPreferenceDateTime_StorageValue } from '../dialog/preferences/DialogPreferenceDateTime';
import update from 'immutability-helper';

interface ReduxStateProps 
{
  user: ReduxUser
}

const mapStateToProps = (state: ReduxState): ReduxStateProps =>
{
  return {
    user: state.user!
  }
}

type Props = ReduxStateProps & WithBackButtonInterceptorProps & WithDialogContainerProps & WithDatabaseProps &
{
    navigation: HiEfficiencyNavigator
}

type State = WithDialogContainerState & 
{
    team: AbstractFirestoreDocument<DocumentTeam>,
    fabEnabled: boolean
}

type Mode = "Edit" | "Create";

class ScreenTeamEdit extends Component<Props, State>
{
    static displayName = "Screen Team Edit";

    private unsavedChanges: boolean = false;
    private confirmationDialog?: ConcreteDialogConfirmation;
    private mode: Mode;

    constructor(props: Props)
    {
        super(props);
        
        const team = this.props.navigation.getParam("team");
        if(team == undefined || team == null)
        {   this.mode = "Create";}
        else
        {   this.mode = "Edit";}

        this.state =
        {
          team: team,
          fabEnabled: true,
          dialogs: []
        } 
    }

    onHardwareBackPress = () =>
    {   return this.onSoftwareBackPress();}
 
    onSoftwareBackPress = () =>
    {
        if(this.unsavedChanges == false || this.confirmationDialog == undefined)
        {   return false;}

        if(this.confirmationDialog.base)
        {   this.confirmationDialog.base.setVisible(true);}

        return true;
    }

    onTextValueChanged = (field: keyof DocumentTeam) => async (value: DialogPreferenceText_StorageValue) =>
    {
      this.unsavedChanges = true;
      const newData = update(this.state.team, {[field]: {$set: value.text}});
  
      this.setState({team: newData});
    }

    onDateValueChanged = (field: keyof DocumentTeam) => async (value: DialogPreferenceDateTime_StorageValue) =>
    {
      this.unsavedChanges = true;
      const newData = update(this.state.team, { [field]: {$set: value.timestamp}});
  
      this.setState({team: newData});
    }

    onDialogConfirmed = (_baseComponent: ConcreteDialogConfirmation | undefined, action: DialogConfirmationActionUnion) =>
    {
        switch(action) 
        {
            case "Positive":
                this.props.navigation.goBack();
                break;
        }
    }

    onFabPress = async () =>
    {
        this.setState({fabEnabled: false});

        if(this.mode == "Create")
        {
            await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Creating Team", async (execute) => 
            {
                const create = this.props.database.createTeam(this.state.team.data, this.props.user.document.id!, this.props.user.document.data.teams);
                create.onCompleteListener = (successful: boolean) =>  
                {
                    if(successful)
                    {   this.props.navigation.goBack();}
                }
                await execute(create, false);
            });
        }
        else
        {
            const updates = UtilityUpdate.getUpdatesFromShallowObject(this.state.team);
            const oldTeam = this.props.navigation.getParam("team");
            await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Updating Team", async (execute) => 
            {
                const update = this.props.database.updateTeam(this.state.team.id!, oldTeam.data, updates);
                update.onCompleteListener = (successful: boolean) =>  
                {
                    if(successful)
                    {   this.props.navigation.goBack();}
                }
                await execute(update, false);
            });
        }
    }

    render()
    {
        return (
            <View style={{height: "100%"}}>
                <PreferenceCategory title="Basic Information">
                    <PreferenceText title="Team Name" label="Team Name" storageValue={{text: this.state.team.data.name}} onValueChanged={this.onTextValueChanged("name")}/>
                    <PreferenceText title="Security Code" label="Security Code" storageValue={{text: this.state.team.data.code}} onValueChanged={this.onTextValueChanged("code")}/>
                </PreferenceCategory>
                <PreferenceCategory title="Sprints">
                    <PreferenceDateTime mode="date" title="Date of first sprint" label="Date of first sprint" storageValue={{timestamp: this.state.team.data.dateOfFirstSprint}} onValueChanged={this.onDateValueChanged("dateOfFirstSprint")} />
                </PreferenceCategory>
                <InputFloatingActionButton enabled={this.state.fabEnabled} icon="save" onPress={this.onFabPress} />
                <DialogConfirmation concreteRef={i => this.confirmationDialog = i} title="Unsaved Changes" onActionClickListener={this.onDialogConfirmed} textPositive="Discard" textNegative="Cancel"  message="There are unsaved changes to the team. Are you sure you want to go back and discard your unsaved changes?"/>
                {this.state.dialogs.map(dialog => dialog)}
            </View>
        );
    }
}

const hoc1 = WithReduxSubscription<ScreenTeamEdit, ScreenTeamEdit, Props, ReduxStateProps, {}>(mapStateToProps, undefined)(ScreenTeamEdit);
const hoc2 = WithDialogContainer(hoc1);
const hoc3 = WithDatabase(hoc2);
const hoc4 = withBackButtonInterceptor(hoc3);

export default hoc4;