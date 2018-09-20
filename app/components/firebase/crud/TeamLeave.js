import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_USER_LEFT_TEAM} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_CONFIRMING, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class TeamLeave extends AbstractCrudOperation
{

    constructor(teamId, currentTeams, userId)
    {
        super("Please be patient while we try to leave the team..");

        this.teamId = teamId;
        this.currentTeams = currentTeams;
        this.userId = userId;
    }

    onRollback = async (dialog) =>
    {
        const user = FirebaseAdapter.getUsers().doc(this.userId);
        this.attemptRollback(0, 10, async () => 
        {   await user.update({teams: this.currentTeams});});
    }

    perform = async (dialog) => 
    {
        var index = this.currentTeams.indexOf(this.teamId);
        if(index > -1)
        {
            const newTeams = update(this.currentTeams, {$splice: [[index, 1]]})
            try
            {
                await this.sendUpdates(dialog, ACTION_TYPE_USER_LEFT_TEAM, async () => 
                {   await FirebaseAdapter.getUsers().doc(this.userId).update({ teams: newTeams });});

                this.onSuccess(dialog, "You have successfully left the team.");
            }
            catch(error)
            {   this.onError(dialog, "Team could not be left, please try again.", error);}
        }
        else
        {   this.onError(dialog, "It appears you are somehow already not a member of this team.");}
    }
}