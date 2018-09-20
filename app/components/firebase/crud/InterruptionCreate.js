import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_INTERRUPTIONS_OF_STORY_LOADED, ACTION_TYPE_USER_JOINED_TEAM, ACTION_TYPE_STORY_CREATED} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_WAITING_FOR_CONFIRMATION, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class InterruptionCreate extends AbstractCrudOperation
{
    constructor(teamId, storyId, userId, currentInterruptions, newInterruption)
    {
        super("Please be patient while we try to create the interruption..");

        this.teamId = teamId;
        this.storyId = storyId;
        this.userId = userId;
        this.currentInterruptions = currentInterruptions;
        this.newInterruption = newInterruption;
    }

    onRollback = async (dialog) =>
    {
        var keys = Object.keys(this.currentInterruptions);
        var values = keys.map(v => this.currentInterruptions[v]);

        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId).set(values); });   
    }

    perform = async (dialog) => 
    {
        //console.log("Creating Interruption: " + UtilityObject.stringify(this.newInterruption) + " for team: " + this.teamId + " and story: " + this.storyId + " and user: " + this.userId);
        //console.log("PreviousInterruptions were: " + UtilityObject.stringify(this.currentInterruptions));

        const document = FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId);
        const newInterruptions = update(this.currentInterruptions, {$push: [this.newInterruption]});

        var keys = Object.keys(newInterruptions);
        var newInterruptionsAsArray = keys.map(v => newInterruptions[v]);

        //console.log("NewInterruptions are: " + UtilityObject.stringify(newInterruptionsAsArray));

        try
        {
            var closure = undefined;
            if(newInterruptionsAsArray.length == 1)
            {   
                closure = async () => 
                {   await document.set({interruptions: newInterruptionsAsArray});};
            }
            else
            {
                closure = async () => 
                {   await document.update({interruptions: newInterruptionsAsArray});};
            }

            await this.sendUpdates(dialog, ACTION_TYPE_INTERRUPTIONS_OF_STORY_LOADED, closure);
            this.onSuccess(dialog, "Successfully created interruption.");
        }
        catch(error) 
        {   this.onError(dialog, "Something went wrong while creating the interruption, please try again.", error);}
    }

}