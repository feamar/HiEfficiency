import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_STORIES_OF_TEAM_LOADED, ACTION_TYPE_USER_JOINED_TEAM} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_WAITING_FOR_CONFIRMATION, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class TeamCreate extends AbstractCrudOperation
{
    constructor(name, code, dateOfFirstSprint, currentTeams, userId)
    {
        super("Please be patient while we try to create the team..");

        this.team = {name: name, code: code, dateOfFirstSprint: dateOfFirstSprint};
        this.currentTeams = currentTeams;
        this.userId = userId;
    }

    onRollback = async (dialog) =>
    {
        if(this.doc)
        {
            const user = FirebaseAdapter.getUsers().doc(this.userId);
            this.attemptRollback(0, 10, async () =>
            {   await user.update({teams: this.currentTeams});});

            this.attemptRollback(0, 10, async () => 
            {   await this.doc.delete();});
        }
    }

    perform = async (dialog) => 
    {
        this.doc = await this.sendUpdates(dialog, ACTION_TYPE_STORIES_OF_TEAM_LOADED, async () => 
        {   return await FirebaseAdapter.getTeams().add(this.team);});

        if(dialog.isTimedOut())
        {   return;}
        
        dialog.setMessage("Team created, now joining new team.");
        const newData = update(this.currentTeams, {$push: [this.doc.id]});
        try
        {
            await this.sendUpdates(dialog, ACTION_TYPE_USER_JOINED_TEAM, async () => 
            {   await FirebaseAdapter.getUsers().doc(this.userId).update({teams: newData});});

            this.onSuccess(dialog, "You have successfully created and joined the new team.");
        }
        catch(error)
        {   this.onError(dialog, "Team could not be created, please try again.", error);}
    }
}