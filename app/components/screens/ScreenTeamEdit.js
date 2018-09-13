import React, {Component} from 'react';
import PreferenceCategory from '../preferences/PreferenceCategory';
import PreferenceText from '../preferences/fields/PreferenceText';
import {FAB} from "react-native-paper";
import {View, ToastAndroid} from 'react-native';
import PreferenceDateTime from '../preferences/fields/PreferenceDateTime';
import DialogConfirmation from '../dialogs/instances/DialogConfirmation';
import withBackButtonInterceptor from "../../hocs/WithBackButtonInterceptor";
import ActionType from '../../enums/ActionType';
import FirebaseAdapter from '../firebase/FirebaseAdapter';
import update from 'immutability-helper';

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
          shouldFabGroupRender: true
        } 
    }

    onHardwareBackPress = () =>
    {   return this.onSoftwareBackPress();}
 
    onSoftwareBackPress = () =>
    {
        if(this.unsavedChanges == false || this.confirmationDialog == undefined)
        {   return false;}

        this.confirmationDialog.setVisible(true);
        return true;
    }

    setFabVisibility = (visible) =>
    {   this.setState({shouldFabGroupRender: visible});}

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

    onFabPress = () =>
    {
        FirebaseAdapter.getTeams().doc(this.state.team.id).update(this.state.team.data).then(() => 
        {
            ToastAndroid.show("Team successfully updated!", ToastAndroid.LONG);
            this.props.navigation.goBack();
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
                {this.state.shouldFabGroupRender && <FAB.Group icon="save" color="white" open={false} onPress={this.onFabPress} actions={[]} onStateChange={(open) => {} } />}
                <DialogConfirmation ref={i => this.confirmationDialog = i} message="There are unsaved changes to the team. Are you sure you want to go back and discard your unsaved changes?" title="Unsaved Changes" onDialogActionPressed={this.onDialogConfirmed} textPositive="Discard" textNegative="Cancel" />
            </View>
        );
    }
}

export default withBackButtonInterceptor(ScreenTeamEdit);