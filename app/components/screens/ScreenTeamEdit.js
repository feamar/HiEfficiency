import React, {Component} from 'react';
import PreferenceCategory from '../preferences/PreferenceCategory';
import PreferenceText from '../preferences/fields/PreferenceText';
import {FAB} from "react-native-paper";
import {View, ToastAndroid} from 'react-native';
import PreferenceDateTime from '../preferences/fields/PreferenceDateTime';
import DialogConfirmation from '../dialogs/instances/DialogConfirmation';
import withBackButtonInterceptor from "../../hocs/WithBackButtonInterceptor";
import ActionType from '../../enums/ActionType';
import update from 'immutability-helper';
import WithDatabase from "../../hocs/WithDatabase";
import ResolveType from "../../enums/ResolveType";
import UtilityUpdate from '../../utilities/UtilityUpdate';
import WithDialogContainer from '../../hocs/WithDialogContainer';
import CrudEvent from '../../enums/CrudEvent';
import UtilityObject from '../../utilities/UtilityObject';
import UtilityAsync from '../../utilities/UtilityAsync';
import InputFloatingActionButton from "../inputs/InputFloatingActionButton";

class ScreenTeamEdit extends Component
{
    static displayName = "Screen Team Edit";
    constructor(props)
    {
        super(props);
        this.unsavedChanges = false;
        
        const team = this.props.navigation.getParam("team");
        this.state =
        {
          team: team,
          fabEnabled: true
        } 
    }
s
    onHardwareBackPress = () =>
    {   return this.onSoftwareBackPress();}
 
    onSoftwareBackPress = () =>
    {
        console.log("onSoftwareBackPress: " + this.unsavedChanges + " and  " + this.confirmationDialog);
        if(this.unsavedChanges == false || this.confirmationDialog == undefined)
        {   return false;}

        this.confirmationDialog.setVisible(true);
        return true;
    }

    onValueChanged = (field) => (value) =>
    {
        var team = this.state.team;
        if(team.data[field] == value)
        {   return;}

        this.unsavedChanges = true;
        team = update(team, {data: {[field]: {$set: value}}});
        this.setState({team: team});
    }

    onDialogConfirmed = (action) =>
    {
        switch(action) 
        {
            case ActionType.POSITIVE:
                this.props.navigation.goBack();
                break;
        }
    }

    onFabPress = async () =>
    {
        this.setState({fabEnabled: false});

        const updates = UtilityUpdate.getUpdatesFromShallowObject(this.state.team.data);
        const oldTeam = this.props.navigation.getParam("team").data;
        await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Updating Team", async (execute) => 
        {
            const update = this.props.database.updateTeam(this.state.team.id, oldTeam, updates);
            update.setOnDialogClosedListener(() => 
            {   this.props.navigation.goBack();});
            await execute(update);
        });

    }

    render()
    {
        return (
            <View style={{height: "100%"}}>
                <PreferenceCategory title="Basic Information">
                    <PreferenceText title="Team Name" storageValue={this.state.team.data.name} onValueChanged={this.onValueChanged("name")}/>
                    <PreferenceText title="Security Code" storageValue={this.state.team.data.code} onValueChanged={this.onValueChanged("code")}/>
                </PreferenceCategory>
                <PreferenceCategory title="Sprints">
                    <PreferenceDateTime title="Date of first sprint" mode="date" storageValue={this.state.team.data.dateOfFirstSprint} onValueChanged={this.onValueChanged("dateOfFirstSprint")} />
                </PreferenceCategory>
                <InputFloatingActionButton enabled={this.state.fabEnabled} icon="save" onPress={this.onFabPress} />
                <DialogConfirmation ref={i => this.confirmationDialog = i} message="There are unsaved changes to the team. Are you sure you want to go back and discard your unsaved changes?" title="Unsaved Changes" onDialogActionPressed={this.onDialogConfirmed} textPositive="Discard" textNegative="Cancel" />
            </View>
        );
    }
}

const hoc1 = WithDialogContainer(ScreenTeamEdit);
const hoc2 = WithDatabase(hoc1);
const hoc3 = withBackButtonInterceptor(hoc2);

export default hoc3;