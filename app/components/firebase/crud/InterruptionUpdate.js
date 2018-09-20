import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_USER_LEFT_TEAM, ACTION_TYPE_STORY_DATA_CHANGED, ACTION_TYPE_INTERRUPTIONS_OF_STORY_LOADED} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_CONFIRMING, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class InterruptionUpdate extends AbstractCrudOperation
{
    constructor(teamId, storyId, userId, currentInterruptions, oldInterruption, updates)
    {
        super("Please be patient while we try to update the interruption..");

        this.teamId = teamId;
        this.storyId = storyId;
        this.userId = userId;
        this.currentInterruptions = currentInterruptions;
        this.oldInterruption = oldInterruption;
        this.updates = updates;
    }

    onRollback = async (dialog) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId).set(this.currentInterruptions);});
    }

    perform = async (dialog) => 
    {
        //console.log("UPDATING INTERRUPTION FOR " + this.teamId + " and " + this.storyId + " and " + this.userId + " with old: " + UtilityObject.stringify(this.oldInterruption)  + " and updates: " + UtilityObject.stringify(this.updates) + " and current interruptions is a collection of : " + UtilityObject.stringify(this.currentInterruptions));
        
        const index = this.currentInterruptions.indexOf(this.oldInterruption);
        if(index < 0)
        {   
            this.onError(dialog, "The interruption you want to update could not be found, please try again.", undefined);
            return;
        }

        const newInterruption = update(this.oldInterruption, this.updates);
        const newInterruptions = update(this.currentInterruptions, {$splice: [[index, 1, newInterruption]]});
        try
        {
            await this.sendUpdates(dialog, ACTION_TYPE_INTERRUPTIONS_OF_STORY_LOADED, async () => 
            {   await FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId).update({interruptions: newInterruptions});});

            this.onSuccess(dialog, "Successfully updated the interruption.");
        }
        catch(error)
        {   this.onError(dialog, "Something went wrong while updating the interruption, please try again.", error);}
    }
}