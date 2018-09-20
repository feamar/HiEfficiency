import FirebaseAdapter from "./FirebaseAdapter";
import ResolveType from "../../enums/ResolveType";
import {ToastAndroid, NetInfo} from 'react-native';
import DatabaseActionType from "../../enums/DatabaseActionType";
import UtilityString from "../../utilities/UtilityString";
import update from "immutability-helper";
import UtilityObject from "../../utilities/UtilityObject";
import ReduxManager from "../../redux/ReduxManager";
import FirebaseManager from "./FirebaseManager";
import * as ReducerUser from "../../redux/reducers/ReducerUser";
import TeamJoin from "./crud/TeamJoin";
import TeamLeave from "./crud/TeamLeave";
import TeamCreate from "./crud/TeamCreate";
import TeamDelete from "./crud/TeamDelete";
import UserUpdate from "./crud/UserUpdate";
import TeamUpdate from "./crud/TeamUpdate";
import StoryUpdate from "./crud/StoryUpdate";
import StoryCreate from "./crud/StoryCreate";
import StoryDelete from "./crud/StoryDelete";
import InterruptionDelete from "./crud/InterruptionDelete";
import InterruptionUpdate from "./crud/InterruptionUpdate";
import InterruptionCreate from "./crud/InterruptionCreate";
import { SECTION_CONNECTING } from "./crud/AbstractCrudOperation";
import React from "react";
import DialogLoading from "../dialogs/instances/DialogLoading";

class SingletonEnforcer {}
const EnforcerInstance = new SingletonEnforcer();

export default class FirestoreFacade
{
    static Instance = new FirestoreFacade(EnforcerInstance);
    constructor(enforcer)
    {
        if(enforcer != EnforcerInstance)
        {   throw new Error("Cannot create additional runtime instances of the FirestoreFacade singleton.");}

        this.adapter = FirebaseAdapter;
        this.state = {};
    }

    updateUser = (userId, oldUser, updates ) =>
    {
        return new UserUpdate(userId, oldUser, updates );
    }

    deleteTeam = (teamId, currentTeams, userId ) =>
    {
        return new TeamDelete(teamId, currentTeams, userId );
    }

    leaveTeam = (teamId, currentTeams, userId ) =>
    {
        return new TeamLeave(teamId, currentTeams, userId );
    }

    joinTeam = (name, code, currentTeams, userId ) =>
    {
        return new TeamJoin(name, code, currentTeams, userId );
    }

    createTeam = (name, code, currentTeams, userId ) =>
    {
        return new TeamCreate(name, code, currentTeams, userId );
    }

    updateTeam = (teamId, oldTeam, updates ) =>
    {
        return new TeamUpdate(teamId, oldTeam, updates );
    }

    updateStory = (teamId, storyId, oldStory, updates ) =>
    {
        return new StoryUpdate(teamId, storyId, oldStory, updates );
    }

    createStory = (teamId, story ) =>
    {
        return new StoryCreate(teamId, story );
    }
    
    deleteStory = (teamId, storyId ) =>
    {
        return new StoryDelete(teamId, storyId );
    }

    createInterruption = (teamId, storyId, userId, currentInterruptions, newInterruption ) =>
    {
        return new InterruptionCreate(teamId, storyId, userId, currentInterruptions, newInterruption );
    }

    updateInterruption = (teamId, storyId, userId, currentInterruptions, oldInterruption, updates ) =>
    {
        return new InterruptionUpdate(teamId, storyId, userId, currentInterruptions, oldInterruption, updates );
    }

    deleteInterruption = (teamId, storyId, userId, currentInterruptions, indexToDelete ) =>
    {
       return new InterruptionDelete(teamId, storyId, userId, currentInterruptions, indexToDelete );
    }

    inDialog = (addDialogCallback, removeDialogCallback, title, closure) => 
    {
        return new Promise((resolve, reject) => 
        {
            console.log("Inside promise");
            const execute = (dialog, hasNextOperation) => async (crud) =>
            {   
                dialog.setMessage(crud.initialMessage);
                await crud.execute(dialog);

                console.log("Has next operation: " + hasNextOperation);
                if(hasNextOperation == false || hasNextOperation == undefined)
                {   dialog.setCompleted();}
            }

            const onReference = (ref) => 
            {
                if(ref)
                {   closure(execute(ref));}
            }
    
            const component = <DialogLoading 
                ref = {onReference}
                title={title}
                key={title} 
                section={SECTION_CONNECTING}
                isComplete={false}
                timeout={30000} 
                visible={true} 
                cancelable={false}
                warning={undefined} 
                onClose={() => {removeDialogCallback(component); resolve();}} />
    
            addDialogCallback(component);
        });
    } 
}