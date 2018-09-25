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
import WithReduxListener from '../../hocs/WithReduxListener';


export const MODE_CREATE = "Create Team";
export const MODE_EDIT = "Edit Team";


const mapStateToProps = (state, props) =>
{
  return {
    user: state.user
  }
}

class ScreenTeamEdit extends Component
{
    static displayName = "Screen Team Edit";
    constructor(props)
    {
        super(props);
        var team = this.props.navigation.getParam("team");

        this.mode = team == undefined ? MODE_CREATE : MODE_EDIT;
        this.fields = {};
        this.props.navigation.setParams({title: this.mode});
        
        if(team == undefined)
        {
            team = 
            {
                data:
                {
                    name: undefined,
                    code: undefined,
                    dateOfFirstSprint: undefined
                }
            };
        }

        this.state =
        {
          team: team,
          fabEnabled: true,
          unsavedChanges: false
        } 

        this.setLoading(props);
    }

    setLoading = (props) =>
    {   this.props.setLoading(props.user == undefined);}

    onHardwareBackPress = () =>
    {   return this.onSoftwareBackPress();}
 
    onSoftwareBackPress = () =>
    {
        if(this.state.unsavedChanges == false || this.confirmationDialog == undefined)
        {   return false;}

        this.confirmationDialog.setVisible(true);
        return true;
    }

    onValueChanged = (field) => (value) =>
    {
        var team = this.state.team;
        if(team.data[field] == value)
        {   return;}

        team = update(team, {data: {[field]: {$set: value}}});
        this.setState({unsavedChanges: true, team: team});
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

        const keys = Object.keys(this.fields);
        var valid = true;

        for(var i = 0 ; i < keys.length ; i++)
        {
            const key = keys[i];
            const field = this.fields[key];

            if(field.validate() == false)
            {   valid = false;}
        }   

        console.log("MODE: " + this.mode);
        console.log("VALID: " + valid);
        if(valid == false) 
        {
            this.setState({fabEnabled: true});
            return;
        }

        switch(this.mode)
        {
            case MODE_CREATE:
                await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Creating Team", async (execute) => 
                {
                    const data = this.state.team.data;
                    const create = this.props.database.createTeam(data.name, data.code, data.dateOfFirstSprint, this.props.user.data.teams, this.props.user.uid);
                    create.setOnDialogClosedListener(() =>
                    {   
                        this.setState({fabEnabled: false});
                        this.props.navigation.goBack();
                    });
                    await execute(create);
                });
                break;

            case MODE_EDIT:
                const updates = UtilityUpdate.getUpdatesFromShallowObject(this.state.team.data);
                const oldTeam = this.props.navigation.getParam("team").data;
                await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Updating Team", async (execute) => 
                {
                    const update = this.props.database.updateTeam(this.state.team.id, oldTeam, updates);
                    update.setOnDialogClosedListener(() => 
                    {   
                        this.setState({fabEnabled: false});
                        this.props.navigation.goBack();
                    });
                    await execute(update);
                });
                break;
        }
    }

    render()
    {
        return (
            <View style={{height: "100%"}}>
                <PreferenceCategory title="Basic Information">
                    <PreferenceText ref={c => this.fields.name = c} required title="Team Name" storageValue={this.state.team.data.name} onValueChanged={this.onValueChanged("name")}/>
                    <PreferenceText ref={c => this.fields.code = c} required title="Security Code" storageValue={this.state.team.data.code} onValueChanged={this.onValueChanged("code")}/>
                </PreferenceCategory>
                <PreferenceCategory title="Sprints">
                    <PreferenceDateTime title="Date of first sprint" mode="date" storageValue={this.state.team.data.dateOfFirstSprint} onValueChanged={this.onValueChanged("dateOfFirstSprint")} />
                </PreferenceCategory>
                <InputFloatingActionButton enabled={this.state.fabEnabled && this.state.unsavedChanges} icon="save" onPress={this.onFabPress} />
                <DialogConfirmation ref={i => this.confirmationDialog = i} message="There are unsaved changes to the team. Are you sure you want to go back and discard your unsaved changes?" title="Unsaved Changes" onDialogActionPressed={this.onDialogConfirmed} textPositive="Discard" textNegative="Cancel" />
            </View>
        );
    }
}

const hoc1 = WithDialogContainer(ScreenTeamEdit);
const hoc2 = WithDatabase(hoc1);
const hoc3 = withBackButtonInterceptor(hoc2);
const hoc4 = WithReduxListener(mapStateToProps, undefined, hoc3);

export default hoc4;