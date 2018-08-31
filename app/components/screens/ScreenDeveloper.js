import React, {Component} from 'react';
import { View } from "react-native";
import FirebaseAdapter from "../firebase/FirebaseAdapter";
import { TouchableRipple } from '../../../node_modules/react-native-paper';
import {Text} from "react-native-paper";
import InterruptionType from '../../enums/InterruptionType';

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
                        const data = story.data();
                        //Successfully ran against production database on 31/08/2018 - 19:32
                        //Add the interruptions from the story document to the interruptions document.
                        /*if(data.interruptions != undefined)
                        {
                            const interruptions = [];

                            for(var i = 0 ; i < data.interruptions.length ; i += 2)
                            {
                                const current = data.interruptions[i];
                                const end = data.interruptions[i + 1];
                                const category = data.interruptionCategories[i/2];

                                var categoryId = 1;
                                if(category == "meeting")
                                {   categoryId = InterruptionType.Meeting.dbId;}
                                else if (category == "waiting")
                                {   categoryId = InterruptionType.WaitingForOthers.dbId;}
                                else if(category == "other")
                                {   categoryId = InterruptionType.Other.dbId;}


                                const interruption = {
                                    timestamp: current.getTime(),
                                    category: categoryId,
                                    duration: end == undefined ? undefined : end.getTime() - current.getTime() 
                                };

                                interruptions.push(interruption);
                            }
    
                            const userIdTeun = "2wpB3Rpz84UbD6iTcGiplJHaPKs2";
                            story.ref.collection("interruptionsPerUser").doc(userIdTeun).set({interruptions: interruptions});
                        }*/
                        
                        //Successfully ran against production database on 31/08/2018 - 19:38
                        //Remove the interruptions from the story document.
                        /*const update = {
                            description: data.description,
                            finishedOn: data.finishedOn,
                            name: data.name,
                            points: data.points,
                            startedOn: data.startedOn,
                            type: data.type,
                            upvotes: data.upvotes    
                        };

                        if(update.type == undefined)
                        {   update.type = 1;}

                        if(update.upvotes == undefined)
                        {   update.upvotes = 0;}
                        
                        if(update.points == undefined)
                        {   update.points = 0;}

                        story.ref.set(update);*/
                    });
                });
            });
        });

        //Successfully ran against production database on 31/08/2018 - 20:24
        /*const team = FirebaseAdapter.getTeams().doc("shAVidSzBga3rY14CsUv");
        const story = team.collection("stories").doc("ggD9OW0zPLLha6jJdLkA");
        const interruptions = story.collection("interruptionsPerUser").doc("JXyphdFoD4XjXFffGKi8AW95WSJ2");
        interruptions.delete(); */
    }

  render()
  {
    return (
      <View>
        <TouchableRipple onPress={this.migrateInterruptions}><Text>Migrate Interruptions</Text></TouchableRipple>
      </View>
    ); 
  }
}