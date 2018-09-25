import update from 'immutability-helper';
import ReduxManager from "../ReduxManager";
import ReduxUser from '../../dtos/redux/ReduxUser';
import AbstractReduxAction from '../actions/AbstractReduxAction';
import ActionUserLoggedIn from '../actions/ActionUserLoggedIn';
import ReduxTeam from '../../dtos/redux/ReduxTeam';
import ActionUserLoggedOut from '../actions/ActionUserLoggedOut';
import ActionUserDataChanged from '../actions/ActionUserDataChanged';
import ActionUserLeftTeam from '../actions/ActionUserLeftTeam';
import ActionUserJoinedTeam from '../actions/ActionUserJoinedTeam';
import { Dictionary } from '../../bases/collections/Dictionary';

/*
export const ACTION_TYPE_USER_LOGGED_IN = "user_logged_in";
export const ACTION_TYPE_USER_LOGGED_OUT = "user_logged_out";

export const ACTION_TYPE_USER_LEFT_TEAM = "user_left_team"; 
export const ACTION_TYPE_USER_JOINED_TEAM = "user_joined_team";

export const ACTION_TYPE_TEAM_DELETED = "team_deleted";
export const ACTION_TYPE_TEAM_DATA_CHANGED = "team_data_changed";
export const ACTION_TYPE_USER_DATA_CHANGED = "user_data_changed";
export const ACTION_TYPE_STORY_DATA_CHANGED = "story_data_changed";

export const ACTION_TYPE_STORY_DELETED = "story_deleted";
export const ACTION_TYPE_STORY_CREATED = "story_created";
export const ACTION_TYPE_STORIES_OF_TEAM_LOADED = "stories_of_team_loaded";

export const ACTION_TYPE_INTERRUPTIONS_OF_STORY_LOADED = "interruptions_of_story_loaded";

export const onUserLoggedIn = (userId, userSnapshot) =>
{
    return {
        type: ACTION_TYPE_USER_LOGGED_IN,
        snapshot: userSnapshot,
        uid: userId
    }
}

export const onUserLoggedOut = () : ReduxAction =>
{   return new ReduxAction(ACTION_TYPE_USER_LOGGED_OUT);} 

export const onUserLeftTeam = (leftTeamId: string) =>
{
    return new ReduxAction(ACTION_TYPE_USER_LEFT_TEAM, {leftTeamId: leftTeamId});
}

export const onUserJoinedTeam = (joinedTeamSnapshot) =>
{
    return {
        type: ACTION_TYPE_USER_JOINED_TEAM,
        joinedTeamSnapshot: joinedTeamSnapshot
    }
}

export const onUserDataChanged = (userSnapshot) =>
{
    return {
        type: ACTION_TYPE_USER_DATA_CHANGED,
        snapshot: userSnapshot
    }
}

export const onTeamDataChanged = (teamSnapshot) =>
{
    return {
        type: ACTION_TYPE_TEAM_DATA_CHANGED,
        snapshot: teamSnapshot
    }
}

export const onTeamDeleted = (deletedTeamId) =>
{
    return {
        type: ACTION_TYPE_TEAM_DELETED,
        teamId: deletedTeamId
    }
}

export const onStoriesLoaded = (teamId, docChanges) =>
{
    const docs = docChanges.reduce((prev, current, index) => 
    {   
        const data = current.doc.data();
        return update(prev, {[current.doc.id]: {$set: {data: data, id: current.doc.id, interruptions: [], loaded: false}}});
    }, {});

    return {
        type: ACTION_TYPE_STORIES_OF_TEAM_LOADED,
        teamId: teamId,
        docs: docs
    }
}

export const onStoryDataChanged = (teamId, docChange) =>
{
    return {
        type: ACTION_TYPE_STORY_DATA_CHANGED,
        teamId: teamId, 
        storyId: docChange.doc.id,
        data: docChange.doc.data()
    }
}

export const onStoryCreated = (teamId, docChange) =>
{
    return {
        type: ACTION_TYPE_STORY_CREATED,
        teamId: teamId,
        storyId: docChange.doc.id,
        data: docChange.doc.data(),
    }
}

export const onStoryDeleted = (teamId, docChange) =>
{
    return {
        type: ACTION_TYPE_STORY_DELETED,
        teamId: teamId, 
        storyId: docChange.doc.id
    }
}

export const onInterruptionsLoaded = (teamId, storyId, interruptions) =>
{
    return {
        type: ACTION_TYPE_INTERRUPTIONS_OF_STORY_LOADED,
        teamId: teamId,
        storyId: storyId,
        interruptions: interruptions
    }
}

/**
 * 
 * 
 * 
 * 
 * 
 * 
 */




export default (user: ReduxUser | undefined, action: AbstractReduxAction) => 
{
    ReduxManager.Instance.notifyListeners(action)
    console.log("REDUCER: " + action.type);
    
    if(action instanceof ActionUserLoggedIn)
    {   return new ReduxUser(action.document, {}, false);}

    if(action instanceof ActionUserLoggedOut)
    {   return undefined;}

    if(user == undefined)
    {   return user;}

    if(action instanceof ActionUserDataChanged)
    {   return update(user, {document: {$set: action.document}});}

    if(action instanceof ActionUserLeftTeam)
    {   return update(user, {teams: {$unset: [action.leftTeamId]}});}

    if(action instanceof ActionUserJoinedTeam)
    {
        const team: ReduxTeam = new ReduxTeam(action.document, {}, false);
        const dict: Dictionary<ReduxTeam> = {};
        dict[15] = team; 

        const id: string = action.document.id!;
        update(user, {teams: {$merge: [id: team]}});
    }


    return user;



    switch(action.type)
    {
        case ActionUserLoggedIn.TYPE:

            copy = action.pay
            copy = {
                uid: action.uid, 
                data: action.snapshot.data(),
                teams: {}   
            };
            return copy;

        case ACTION_TYPE_USER_DATA_CHANGED:
            copy = update(user, {data: {$set: action.snapshot.data()}});
            return copy;

        case ACTION_TYPE_USER_LOGGED_OUT:
            return null;

        case ACTION_TYPE_USER_LEFT_TEAM:
            index = user.data.teams.indexOf(action.leftTeamId);
            if(index >= 0)
            {   copy = update(user, {teams: {$unset: [action.leftTeamId]}, data: {teams: {$splice: [[index, 1]]}}});}
            else
            {   copy = update(user, {teams: {$unset: [action.leftTeamId]}});}
            
            return copy;

        case ACTION_TYPE_TEAM_DELETED:
            copy = update(user, {teams: {$unset: [action.teamId]}});
            return copy;

        case ACTION_TYPE_USER_JOINED_TEAM:
            const newTeam = {
                id: action.joinedTeamSnapshot.id,
                data: action.joinedTeamSnapshot.data(),
                stories: {},
                loaded: false
            }
            copy = update(user, {loaded: {$set: true}, teams: {[action.joinedTeamSnapshot.id]: {$set: newTeam}}});
            return copy;

        case ACTION_TYPE_TEAM_DATA_CHANGED:
            copy = update(user, {teams: {[action.snapshot.id] : {data: {$set: action.snapshot.data()}}}});
            return copy;

        case ACTION_TYPE_STORY_DATA_CHANGED:
            copy = update(user, {teams:{[action.teamId]: {stories: {[action.storyId] : {data:{$set: action.data}}}}}});
            return copy;

        case ACTION_TYPE_STORY_CREATED:
            copy = update(user, {teams:{[action.teamId]: {stories: {[action.storyId]: {$set: {loaded: false, data: action.data, id: action.storyId, interruptions: []}}}}}});
            return copy;

        case ACTION_TYPE_STORY_DELETED:
            copy = update(user, {teams: {[action.teamId]: {stories: {$unset: [action.storyId]}}}})
            return copy;

        case ACTION_TYPE_STORIES_OF_TEAM_LOADED:
            copy = update(user, {teams: {[action.teamId]: {loaded: {$set: true}, stories: {$merge: action.docs}}}});
            return copy;

        case ACTION_TYPE_INTERRUPTIONS_OF_STORY_LOADED:
            copy = update(user, {teams: {[action.teamId]: {stories: {[action.storyId] : {loaded: {$set: true}, interruptions: {$set: action.interruptions}}}}}})
            return copy;
            
        default:
            return user
    }
};