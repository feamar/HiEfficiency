import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_USER_JOINED_TEAM, ACTION_TYPE_TEAM_DELETED, ACTION_TYPE_STORY_DELETED, ACTION_TYPE_INTERRUPTIONS_OF_STORY_LOADED} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_WAITING_FOR_CONFIRMATION, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class InterruptionDelete extends AbstractCrudOperation
{

    constructor(teamId, storyId, userId, currentInterruptions, indexToDelete)
    {
        super("Please be patient while we try to delete the interruption..");

        this.teamId = teamId;
        this.storyId = storyId;
        this.userId = userId;
        this.currentInterruptions = currentInterruptions;
        this.indexToDelete = indexToDelete;
    }

    onRollback = async (dialog) =>
    {
        const keys = Object.keys(this.currentInterruptions);
        const oldInterruptions = keys.map(v => this.currentInterruptions[v]);

        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId).set({interruptions: oldInterruptions});});
    }

    perform = async (dialog) => 
    {
        console.log("DELETING INTERRUPTION: " + this.teamId + " and " + this.storyId + " and " + this.userId  + " at index: " + this.indexToDelete + " with interruptions: " + UtilityObject.stringify(this.currentInterruptions));
        const document = FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId);
        const newInterruptions = update(this.currentInterruptions, {$splice: [[this.indexToDelete, 1]]});

        try
        {
            await this.sendUpdates(dialog, ACTION_TYPE_INTERRUPTIONS_OF_STORY_LOADED, () => 
            {   document.update({interruptions: newInterruptions});});

            this.onSuccess(dialog, "Successfully deleted the interruption.");
        }
        catch(error)
        {   this.onError(dialog, "Something went wrong while deleting the interruption, please try again.", error);}
    }
}