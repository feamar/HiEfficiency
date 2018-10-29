import React, {Component} from 'react';
import { View, StyleSheet } from "react-native";
import FirebaseAdapter from "../firebase/FirebaseAdapter";
import { TouchableRipple } from 'react-native-paper';
import {Text} from "react-native-paper";
import { RNFirebase } from 'react-native-firebase';

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



    render()
    {
        return (
        <View style={{height: "100%", padding:20}}>
            <TouchableRipple style={styles.button} onPress={this.migrateInterruptions}><Text>Migrate Interruptions</Text></TouchableRipple>
        </View>
        ); 
    }
}