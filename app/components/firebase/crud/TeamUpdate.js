import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_USER_LEFT_TEAM, ACTION_TYPE_TEAM_DATA_CHANGED} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_CONFIRMING, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class TeamUpdate extends AbstractCrudOperation
{
    constructor(teamId, oldTeam, updates)
    {
        super("Please be patient while we try to update the team..");

        this.teamId = teamId;
        this.oldTeam = oldTeam;
        this.updates = updates;
    }

    onRollback = async (dialog) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getTeams().doc(this.teamId).set(this.oldTeam);});
    }

    perform = async (dialog) => 
    {
        try 
        {
            const newTeam = update(this.oldTeam, this.updates);
            await this.sendUpdates(dialog, ACTION_TYPE_TEAM_DATA_CHANGED, async () => 
            {   await FirebaseAdapter.getTeams().doc(this.teamId).update(newTeam);});
            
            this.onSuccess(dialog, "Successfully updated the team.");
        }
        catch(error)
        {   this.onError(dialog, "Team could not be updated, please try again.", error);}
    }
}