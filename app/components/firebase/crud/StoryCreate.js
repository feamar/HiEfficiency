import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_STORIES_OF_TEAM_LOADED, ACTION_TYPE_USER_JOINED_TEAM, ACTION_TYPE_STORY_CREATED} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_WAITING_FOR_CONFIRMATION, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class StoryCreate extends AbstractCrudOperation
{
    constructor(teamId, story)
    {
        super("Please be patient while we try to create the story..");

        this.teamId = teamId;
        this.story = story;
    }

    onRollback = async (dialog) =>
    {
        console.log("STORYC REATE ROLLBACK: " + this.doc);
        if(this.doc)
        {
            this.attemptRollback(0, 10, async () => 
            {   await this.doc.delete();});
        }
    }

    perform = async (dialog) => 
    {
        console.log("CREATING STORY: " + UtilityObject.stringify(this.story));
        try
        {
            console.log("ONE ONE ONE");
            this.doc = await this.sendUpdates(dialog, ACTION_TYPE_STORY_CREATED, () => 
            {
                console.log("TWO TWO TWO");
                return FirebaseAdapter.getStories(this.teamId).add(this.story);
            });

            console.log("THREE THREE THREE");
    
            this.onSuccess(dialog, "Story successfully created!");
            console.log("FOUR FOUR FOUR");
        }
        catch(error)
        {
            console.log("FIVE FIVE FIVE");
            this.onError(dialog, "Something went wrong while creating the story, please try again later.", error);
            console.log("SIX SIX SIX");
        }
    }
}