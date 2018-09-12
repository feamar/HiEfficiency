import React, {Component} from 'react';
import { View } from "react-native";
import FirebaseAdapter from "../firebase/FirebaseAdapter";
import { TouchableRipple, Button } from 'react-native-paper';
import {Text} from "react-native-paper";
import InterruptionType from '../../enums/InterruptionType';
import UtilityObject from '../../utilities/UtilityObject';
import { onUserLoggedIn } from '../../redux/reducers/ReducerUser';

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

    onUserLoggedInReducer = () =>
    {

    }

    render()
    {
        return (
        <View style={{height: "100%"}}>
            <TouchableRipple onPress={this.migrateInterruptions}><Text>Migrate Interruptions</Text></TouchableRipple>
        </View>
        ); 
    }
}