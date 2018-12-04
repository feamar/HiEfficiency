import React, {Component} from 'react';
import { View, StyleSheet } from "react-native";
import FirebaseAdapter from "../firebase/FirebaseAdapter";
import { TouchableRipple } from 'react-native-paper';
import {Text} from "react-native-paper";
import { RNFirebase } from 'react-native-firebase';
import GitHubAuthenticor from '../../etl/github/load/GitHubAuthentication';
import JiraAuthenticor from '../../etl/jira/oauth/JiraAuthenticator';

const styles = StyleSheet.create({
    button: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5
    }
});

interface Props 
{

}

interface State
{

}

export default class ScreenDeveloper extends Component<Props, State>
{
    constructor(props: Props)
    {
    super(props);
    }

    migrateInterruptions = () =>
    {
        FirebaseAdapter.getTeams().get().then(teams => 
        {
            teams.docs.forEach(team => 
            {
                team.ref.collection("stories").get().then(stories => 
                {
                    stories.docs.forEach((_snapshot: RNFirebase.firestore.DocumentSnapshot) => 
                    {
                        //const document = DocumentStory.fromSnapshot(_snapshot)
                       
                        
                    });
                });
            });
        });
    }


    authorizeGithub = async () =>
    {
        await GitHubAuthenticor.instance.authorize();
    }

    getIssuesGithub = async () =>
    {
        await GitHubAuthenticor.instance.getIssues();
    }

    authorizeJira = async () =>
    {
        await JiraAuthenticor.instance.authorize();
    }


    render()
    {
        return (
        <View style={{height: "100%", padding:20}}>
            <TouchableRipple style={styles.button} onPress={this.migrateInterruptions}><Text>Migrate Interruptions</Text></TouchableRipple>
            <TouchableRipple style={styles.button} onPress={this.authorizeGithub}><Text>Authorize GitHub</Text></TouchableRipple>
            <TouchableRipple style={styles.button} onPress={this.getIssuesGithub}><Text>Get Issues GitHub</Text></TouchableRipple>
            <TouchableRipple style={styles.button} onPress={this.authorizeJira}><Text>Authorize Jira</Text></TouchableRipple>
            <TouchableRipple style={styles.button} onPress={this.getIssuesGithub}><Text>Get Issues GitHub</Text></TouchableRipple>
        </View>
        ); 
    }
}