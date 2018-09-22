import React, {Component} from 'react';
import { View } from "react-native";
import FirebaseAdapter from "../firebase/FirebaseAdapter";
import { TouchableRipple, Button } from 'react-native-paper';
import {Text} from "react-native-paper";
import InterruptionType from '../../enums/InterruptionType';
import UtilityObject from '../../utilities/UtilityObject';
import { onUserLoggedIn } from '../../redux/reducers/ReducerUser';

const styles = {
    button: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5
    }
}
export default class ScreenDeveloper extends Component
{
  constructor()
  {
    super();
  }

    migrateInterruptions = () =>
    {
        FirebaseAdapter.getTeams().get().then(teams => 
        {
            teams.docs.forEach(team => 
            {
                team.ref.collection("stories").get().then(stories => 
                {
                    stories.docs.forEach(story => 
                    {
                       
                    });
                });
            });
        });
    }


    render()
    {
        return (
        <View style={{height: "100%", padding:20}}>
            {/*<TouchableRipple style={styles.button} onPress={this.migrateInterruptions}><Text>Migrate Interruptions</Text></TouchableRipple>*/}
            <TouchableRipple style={styles.button} onPress={this.migrateInterruptions}><Text></Text></TouchableRipple>
        </View>
        ); 
    }
}