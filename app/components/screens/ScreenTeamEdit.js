import React, {Component} from 'react';
import PreferenceCategory from '../preferences/PreferenceCategory';
import PreferenceText from '../preferences/fields/PreferenceText';
import {FABGroup} from "react-native-paper";
import {View, Keyboard, ToastAndroid} from 'react-native';
import {Text} from 'react-native-paper';
import PreferenceDateTime from '../preferences/fields/PreferenceDateTime';

export default class ScreenTeamEdit extends Component
{
    constructor(props)
    {
        super(props);
        console.log("HERE 12");
        this.keyboardUnsubscribers = [];
        this.team = this.props.navigation.getParam("team");
        this.state =
        {
          team: {...this.team.data()},
          shouldFabGroupRender: true
        } 

        console.log("STATE: " + JSON.stringify(this.state.team));
    }

    componentWillMount = () =>
    {
        console.log("HERE 11");

        var unsubscriber = Keyboard.addListener('keyboardDidShow', () => {this.setState({shouldFabGroupRender: false})});
        this.keyboardUnsubscribers.push(unsubscriber);

        unsubscriber = Keyboard.addListener("keyboardDidHide", () => {this.setState({shouldFabGroupRender: true})});
        this.keyboardUnsubscribers.push(unsubscriber);
    }

    componentWillUnmount = () =>
    {
        console.log("HERE 16");

        this.keyboardUnsubscribers.forEach(unsubscriber => unsubscriber.remove());
    }

    onValueChanged = (field) => (value) =>
    {
        console.log("HERE 15");

        console.log("FIELD: " + field);
        const team = this.state.team;
        team[field] = value;
        this.setState({team: team});
    }

    onFabPress = () =>
    {
        console.log("HERE 14");

        this.team.ref.update(this.state.team).then(() => 
        {
            ToastAndroid.show("Team successfully updated!", ToastAndroid.LONG);
            this.props.navigation.goBack();
        });
    }


    render()
    {
        console.log("HERE 13");

        return (
            <View>
                <PreferenceCategory title="Basic Information">
                    <PreferenceText title="Team Name" storageValue={this.state.team.name} onValueChanged={this.onValueChanged("name")}/>
                    <PreferenceText title="Security Code" storageValue={this.state.team.code} onValueChanged={this.onValueChanged("code")}/>
                </PreferenceCategory>
                <PreferenceCategory title="Sprints">
                    <PreferenceDateTime title="Date of first sprint" mode="date" storageValue={this.state.team.dateOfFirstSprint} onValueChanged={this.onValueChanged("dateOfFirstSprint")} />
                </PreferenceCategory>
                {this.state.shouldFabGroupRender && <FABGroup icon="save" color="white" open={false} onPress={this.onFabPress} actions={[]} onStateChange={(open) => {} } />}
            </View>
        );
    }
}