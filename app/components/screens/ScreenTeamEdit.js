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

        this.keyboardUnsubscribers = [];
        this.team = this.props.navigation.getParam("team");
        this.state =
        {
          team: this.team.data(),
          shouldFabGroupRender: true
        } 
    }

    componentWillMount = () =>
    {
        var unsubscriber = Keyboard.addListener('keyboardDidShow', () => {this.setState({shouldFabGroupRender: false})});
        this.keyboardUnsubscribers.push(unsubscriber);

        unsubscriber = Keyboard.addListener("keyboardDidHide", () => {this.setState({shouldFabGroupRender: true})});
        this.keyboardUnsubscribers.push(unsubscriber);
    }

    componentWillUnmount = () =>
    {
        this.keyboardUnsubscribers.forEach(unsubscriber => unsubscriber.remove());
    }

    onValueChanged = (field) => (value) =>
    {
        console.log("FIELD: " + field);
        const team = this.state.team;
        team[field] = value;
        this.setState({team: team});
    }

    onFabPress = () =>
    {
        this.team.ref.update(this.state.team).then(() => 
        {
            ToastAndroid.show("Team successfully updated!", ToastAndroid.LONG);
            this.props.navigation.goBack();
        });
    }


    render()
    {
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