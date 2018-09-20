import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_USER_JOINED_TEAM, ACTION_TYPE_TEAM_DELETED, ACTION_TYPE_STORY_DELETED} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_WAITING_FOR_CONFIRMATION, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class StoryDelete extends AbstractCrudOperation
{

    constructor(teamId, storyId)
    {
        super("Please be patient while we try to delete the story..");

        this.teamId = teamId;
        this.storyId = storyId;
    }

    onRollback = async (dialog) =>
    {
        if(this.oldStory)
        {
            const data = this.oldStory.data();
            this.attemptRollback(0, 10, async () => 
            {   await FirebaseAdapter.getStories(this.teamId).doc(this.storyId).set(data);});
        }
    }

    perform = async (dialog) => 
    {
        try
        {
            

            const doc = FirebaseAdapter.getStories(this.teamId).doc(this.storyId);
            this.oldStory = await doc.get();

            await this.sendUpdates(dialog, ACTION_TYPE_STORY_DELETED, async () => 
            {   await doc.delete();});

            this.onSuccess(dialog, "Successfully deleted the user story.");
        }
        catch(error)
        {   this.onError(dialog, "Something went wrong while deleting the story, please try again.", error);}
    }
}