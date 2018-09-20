import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_USER_JOINED_TEAM} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_WAITING_FOR_CONFIRMATION, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';

export default class TeamJoin extends AbstractCrudOperation
{

    constructor(name, code, currentTeams, userId)
    {
        super("Please be patient while we try to join the team..");

        this.name = name;
        this.code = code;
        this.currentTeams = currentTeams;
        this.userId = userId;
    }

    onRollback = async (dialog) =>
    {
        const user = FirebaseAdapter.getUsers().doc(this.userId);
        this.attemptRollback(0, 10, async () => 
        {   await user.update({teams: this.currentTeams});});
    }

    getMatch = (teams, code) =>
    {
        for(var i = 0 ; i < teams.docs.length ; i ++)
        { 
            const team = teams.docs[i];
            if(team.data().code.toString() == code.toString())
            {   return team;}
        }

        return undefined;
    }


    perform = async (dialog) => 
    {
        var teams = undefined;
        try
        {   teams = await FirebaseAdapter.getTeams().where("name", "==", this.name.toString()).get();}
        catch(error)
        {   this.onError(dialog, "Something went wrong while retrieving the teams, please try again later.", error);}
        
        if(dialog.isTimedOut())
        {   return;}

        const match = this.getMatch(teams, this.code);
        if(match == undefined)
        {
            if(teams.docs.length <= 0)
            {   this.onError(dialog, "No team called '" + this.name + "' could be found.");}
            else
            {   this.onError(dialog,  "A team called '" + this.name + "' could be found, but the security code was incorrect.");}
        }
        else if (this.currentTeams.indexOf(match.id) >= 0)
        {   this.onError(dialog, "You are already a member of this team, and you can not join a team twice.");}
        else
        {
            const newData = update(this.currentTeams, {$push: [match.id]});
            try
            {
                await this.sendUpdates(dialog, ACTION_TYPE_USER_JOINED_TEAM, () => 
                {   FirebaseAdapter.getUsers().doc(this.userId).update({teams: newData});});

                this.onSuccess(dialog, "You have successfully joined the team.");
            }
            catch(error)
            {   this.onError(dialog, "Team could not be joined, please try again.", error);}
        }
    }
}