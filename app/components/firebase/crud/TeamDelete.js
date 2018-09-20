import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_USER_LEFT_TEAM, ACTION_TYPE_TEAM_DELETED} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_WAITING_FOR_CONFIRMATION, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class TeamDelete extends AbstractCrudOperation
{

    constructor(teamId, currentTeams, userId)
    {
        super("Please be patient while we try to delete the team..");

        this.teamId = teamId;
        this.currentTeams = currentTeams;
        this.userId = userId;
    }

    onRollback = async (dialog) =>
    {
        //console.log("ROLLING BACK CHANGES!");
        const user = FirebaseAdapter.getUsers().doc(this.userId);
        if(this.oldTeam)
        {
            const data = this.oldTeam.data();
            const newTeam = await this.attemptRollback(0, 10, async () => 
            {   return await FirebaseAdapter.getTeams().add(data)});

            const index = this.currentTeams.indexOf(this.teamId);
            var newTeams = undefined;
            if(index >= 0)
            {   newTeams = update(this.currentTeams, {$splice: [[index, 1, newTeam.id]]});}
            else
            {   newTeams = update(this.currentTeams, {$push: [newTeam.id]});}

            this.attemptRollback(0, 10, async () => 
            {   await user.update({teams: newTeams});});
        }
        else
        {
            this.attemptRollback(0, 10, async () => 
            {   await user.update({teams: this.currentTeams});});
        }
    }

    perform = async (dialog) => 
    {
        const index = this.currentTeams.indexOf(this.teamId);
        //console.log("Index; " + index + ", teamId: " + this.teamId + " and currentTeams: " + UtilityObject.stringify(this.currentTeams));
        if(index >= 0)
        {   
            try
            {
                const newData = update(this.currentTeams, {$splice: [[index, 1]]});
                await this.sendUpdates(dialog, ACTION_TYPE_USER_LEFT_TEAM, async () => 
                {   await FirebaseAdapter.getUsers().doc(this.userId).update({teams: newData});});
            }
            catch(error)
            {   
                this.onError(dialog, "Something went wrong while leaving the team.", error);
                return;
            }

            if(dialog.isTimedOut())
            {   return;}
        }
        
        try
        {
            const doc = FirebaseAdapter.getTeams().doc(this.teamId);
            this.oldTeam = await doc.get();

            await this.sendUpdates(dialog, ACTION_TYPE_TEAM_DELETED, async () => 
            {   await FirebaseAdapter.getTeams().doc(this.teamId).delete();});

            this.onSuccess(dialog, "You have successfully left and deleted the team.");
        }
        catch(error)
        {   this.onError(dialog, "Team could not be deleted, please try again.", error);}
    }
}