import update from 'immutability-helper';
import ReduxManager from "../ReduxManager";
import ReduxInterruptions from '../../dtos/redux/ReduxInterruptions';
import ReduxUser from '../../dtos/redux/ReduxUser';
import ReduxTeam from '../../dtos/redux/ReduxTeam';
import ReduxStory from '../../dtos/redux/ReduxStory';
import AbstractReduxAction from '../actions/AbstractReduxAction';
import ActionUserLoggedIn from '../actions/user/ActionUserLoggedIn';
import ActionUserLoggedOut from '../actions/user/ActionUserLoggedOut';
import ActionUserDataChanged from '../actions/user/ActionUserDataChanged';
import ActionUserLeftTeam from '../actions/user/ActionUserLeftTeam';
import ActionUserJoinedTeam from '../actions/user/ActionUserJoinedTeam';
import ActionTeamDeleted from '../actions/user/ActionTeamDeleted';
import ActionTeamDataChanged from '../actions/user/ActionTeamDataChanged';
import ActionStoryDataChanged from '../actions/user/ActionStoryDataChanged';
import ActionStoryCreated from '../actions/user/ActionStoryCreated';
import ActionStoryDeleted from '../actions/user/ActionStoryDeleted';
import ActionStoriesOfTeamLoaded from '../actions/user/ActionStoriesOfTeamLoaded';
import ActionInterruptionsOfStoryLoaded from '../actions/user/ActionInterruptionsOfStoryLoaded';

export default (user: ReduxUser | undefined, action: AbstractReduxAction): ReduxUser | undefined => 
{
    ReduxManager.Instance.notifyListeners(action)
    console.log("REDUCER: " + action.type);
    
    if(action instanceof ActionUserLoggedIn)
    {   return new ReduxUser(action.document, new Map<string, ReduxTeam>(), false);}

    if(action instanceof ActionUserLoggedOut)
    {   return undefined;}

    if(user == undefined)
    {   return user;}

    if(action instanceof ActionUserDataChanged)
    {   return update(user, {document: {$set: action.document}});}

    if(action instanceof ActionUserLeftTeam)
    {   return update(user, {teams: {$remove: [action.leftTeamId]}});}

    if(action instanceof ActionUserJoinedTeam || action instanceof ActionTeamDataChanged)
    {
        const id: string = action.document.id!;
        var team: ReduxTeam = new ReduxTeam(action.document, new Map<string, ReduxStory>(), false);
        team = update(team, {document: {$set: action.document}});

        return update(user, {teams: {$add: [[id, team]]}});
    }

    if(action instanceof ActionTeamDeleted)
    {   return update(user, {teams: {$remove: [action.teamId]}});}    

    if(action instanceof ActionStoryDataChanged || action instanceof ActionStoryCreated)
    {
        var team: ReduxTeam | undefined = user.teams.get(action.teamId);
        if(team != undefined)
        {
            const storyId = action.document.id!;
            var story: ReduxStory = team.stories.get(storyId) || new ReduxStory(action.document, new Map<string, ReduxInterruptions>(), false);
            story = update(story, {document: {$set: action.document}});
            team = update(team, {stories: {$add: [[storyId, story]]}});

            return update(user, {teams: {$add: [[action.teamId, team]]}});
        }
    }

    if(action instanceof ActionStoryDeleted)
    {
        var team: ReduxTeam | undefined = user.teams.get(action.teamId);
        if(team != undefined)
        {
            team = update(team, {stories: {$remove: [action.storyId]}});
            return update(user, {teams: {$add: [[action.teamId, team]]}});
        }
    }

    if(action instanceof ActionStoriesOfTeamLoaded)
    {
        var team: ReduxTeam | undefined = user.teams.get(action.teamId);
        if(team != undefined)
        {
            const map = new Map<string, ReduxStory>();
            action.stories.forEach(story => 
            {   map.set(story.id!, new ReduxStory(story, new Map<string, ReduxInterruptions>(), false)); });

            team = update(team, {stories: {$set: map}, loaded: {$set: true}})
            return update(user, {teams: {$add: [[action.teamId, team]]}});
        }
    }

    if(action instanceof ActionInterruptionsOfStoryLoaded)
    {
        var team: ReduxTeam | undefined = user.teams.get(action.teamId);
        if(team != undefined)
        {
            var story: ReduxStory | undefined = team.stories.get(action.storyId);

            const map = new Map<string, ReduxInterruptions>();
            action.interruptions.forEach(interruption => 
            {   map.set(interruption.id!, new ReduxInterruptions(interruption));});

            story = update(story, {interruptions: {$set: map}, loaded: {$set: true}});
            team = update(team, {stories: {$add: [[action.storyId, story]]}});

            return update(user, {teams: {$add: [[action.teamId, team]]}});
        }
    }

    return user;
};