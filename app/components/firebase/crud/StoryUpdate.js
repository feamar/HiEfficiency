import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_USER_LEFT_TEAM, ACTION_TYPE_STORY_DATA_CHANGED} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_CONFIRMING, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class StoryUpdate extends AbstractCrudOperation
{
    constructor(teamId, storyId, oldStory, updates)
    {
        super("Please be patient while we try to update the story..");

        this.teamId = teamId;
        this.storyId = storyId;
        this.oldStory = oldStory;
        this.updates = updates;
    }

    onRollback = async (dialog) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getStories(this.teamId).doc(this.storyId).set(this.oldStory);});
    }

    perform = async (dialog) => 
    {
        console.log("Updating story: teamId: " + this.teamId + " and storyId: " + this.storyId + " and oldStory: " + UtilityObject.stringify(this.oldStory) + " and updates: " + UtilityObject.stringify(this.updates));
        try 
        {
            const newStory = update(this.oldStory, this.updates);
            await this.sendUpdates(dialog, ACTION_TYPE_STORY_DATA_CHANGED, () => 
            {   FirebaseAdapter.getStories(this.teamId).doc(this.storyId).update(newStory);});
            this.onSuccess(dialog, "Successfully updated the story.");
        }
        catch(error)
        {   this.onError(dialog, "Story could not be updated, please try again.", error);}
    }
}