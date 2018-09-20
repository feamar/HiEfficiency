import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_USER_LEFT_TEAM, ACTION_TYPE_USER_DATA_CHANGED} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_CONFIRMING, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class UserUpdate extends AbstractCrudOperation
{
    constructor(userId, oldUser, updates)
    {
        super("Please be patient while we try to update the profile..");

        this.userId = userId;
        this.oldUser = oldUser;
        this.updates = updates;
    }

    onRollback = async (dialog) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getStories(this.teamId).doc(this.storyId).set(this.oldStory);});
    }

    perform = async (dialog) => 
    {
        try 
        {
            const newUser = update(this.oldUser, this.updates);
            await this.sendUpdates(dialog, ACTION_TYPE_USER_DATA_CHANGED, async () => 
            {   await FirebaseAdapter.getUsers().doc(this.userId).update(newUser);});
            
            this.onSuccess(dialog, "Successfully updated the profile.");
        }
        catch(error)
        {   this.onError(dialog, "Profile could not be updated, please try again.", error);}
    }
}