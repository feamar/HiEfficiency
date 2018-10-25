import update from 'immutability-helper';
import ReduxManager from "../ReduxManager";
import ReduxInterruptions from '../../dtos/redux/ReduxInterruptions';
import ReduxUser from '../../dtos/redux/ReduxUser';
import ReduxTeam from '../../dtos/redux/ReduxTeam';
import ReduxStory from '../../dtos/redux/ReduxStory';
import ActionUserLoggedIn from '../actions/user/ActionUserLoggedIn';
import ActionUserLoggedOut from '../actions/user/ActionUserLoggedOut';
import ActionUserDataChanged from '../actions/user/ActionUserDataChanged';
import ActionUserLeftTeam from '../actions/user/ActionUserLeftTeam';
import ActionUserJoinedTeam from '../actions/user/ActionUserJoinedTeam';
import ActionTeamDeleted from '../actions/user/ActionTeamDeleted';
import ActionTeamDataChanged from '../actions/user/ActionTeamDataChanged';
import ActionStoryDataChanged from '../actions/user/ActionStoryDataChanged';
import ActionStoryDeleted from '../actions/user/ActionStoryDeleted';
import ActionStoriesOfTeamLoaded from '../actions/user/ActionStoriesOfTeamLoaded';
import ActionInterruptionsOfStoryLoaded from '../actions/user/ActionInterruptionsOfStoryLoaded';
import { AnyAction } from 'redux';
import UtilityRedux from '../../utilities/UtilityRedux';

export default (user: ReduxUser | undefined | null, action: AnyAction): ReduxUser | null => 
{
    ReduxManager.Instance.notifyListeners(action)
    
    if(UtilityRedux.actionIs<ActionUserLoggedIn>(action, ActionUserLoggedIn.TYPE))
    {   return new ReduxUser(action.document, {}, false);}

    if(UtilityRedux.actionIs<ActionUserLoggedOut>(action, ActionUserLoggedOut.TYPE))
    {   return null;}

    if(user == null || user == undefined)
    {   return null;}

    if(UtilityRedux.actionIs<ActionUserDataChanged>(action, ActionUserDataChanged.TYPE))
    {   return update(user, {document: {$set: action.document}});}

    if(UtilityRedux.actionIs<ActionUserLeftTeam>(action, ActionUserLeftTeam.TYPE))
    {   return update(user, {teams: {$unset: [action.leftTeamId]}});}

    if(UtilityRedux.actionIs<ActionTeamDataChanged>(action, ActionTeamDataChanged.TYPE))
    {
        const id = action.document.id!;
        var team = user.teams[action.document.id!]
        team = update(team, {document: {$set: action.document}});

        return update(user, {teams: {[id]: {$set: team}}});
    }

    if(UtilityRedux.actionIs<ActionUserJoinedTeam>(action, ActionUserJoinedTeam.TYPE))
    {
        const id: string = action.document.id!;
        const team: ReduxTeam = new ReduxTeam(action.document, {}, false);

        return update(user, {teams: {[id]: {$set: team}}});
    }

    if(UtilityRedux.actionIs<ActionTeamDeleted>(action, ActionTeamDeleted.TYPE))
    {   return update(user, {teams: {$unset: [action.teamId]}});}    

    if(UtilityRedux.actionIs<ActionStoryDataChanged>(action, ActionStoryDataChanged.TYPE))
    {
        var team: ReduxTeam | undefined = user.teams[action.teamId];
        if(team != undefined)
        {
            const storyId = action.document.id!;
            var story: ReduxStory = team.stories[storyId] || new ReduxStory(action.document, {}, false);
            story = update(story, {document: {$set: action.document}});
            team = update(team, {stories: {[storyId]: {$set: story}}});

            return update(user, {teams: {[action.teamId]: {$set: team}}});
        }
    }

    if(UtilityRedux.actionIs<ActionStoryDeleted>(action, ActionStoryDeleted.TYPE))
    {
        var team: ReduxTeam | undefined = user.teams[action.teamId];
        if(team != undefined)
        {
            team = update(team, {stories: {$unset: [action.storyId]}});
            return update(user, {teams: {[action.teamId]: {$set: team}}});
        }
    }

    if(UtilityRedux.actionIs<ActionStoriesOfTeamLoaded>(action, ActionStoriesOfTeamLoaded.TYPE))
    {
        var team: ReduxTeam | undefined = user.teams[action.teamId];
        if(team != undefined)
        {
            const map: {[id: string]: ReduxStory} = {};
            action.stories.forEach(story => 
            {
                const oldStory: ReduxStory | undefined = team.stories[story.id!];
                if(oldStory)
                {   map[story.id!] = new ReduxStory(story, oldStory.interruptions, oldStory.loaded);}
                else
                {   map[story.id!] = new ReduxStory(story, {}, false);}
            });


            team = update(team, {stories: {$merge: map}, loaded: {$set: true}})
            return update(user, {teams: {[action.teamId]: {$set: team}}});
        }
    }

    if(UtilityRedux.actionIs<ActionInterruptionsOfStoryLoaded>(action, ActionInterruptionsOfStoryLoaded.TYPE))
    {
        var team: ReduxTeam | undefined = user.teams[action.teamId];

        if(team != undefined)
        {
            var story: ReduxStory | undefined = team.stories[action.storyId];

            const map: {[id: string]: ReduxInterruptions} = {};
            action.interruptions.forEach(interruption => 
            {   
                //If an old interruption is already present in the state, fork over other attributes like "loaded" and subentities. 
                //This is not required at the moment, because interruptions don't have any,
                //but I'll leave this structure plus comment here for future reference.
                //See the same structure in the ActionStoriesOfTeamLoaded above.
                const old = story.interruptions[interruption.id!];
                if(old)
                {   map[interruption.id!] = new ReduxInterruptions(interruption);}
                else
                {   map[interruption.id!] = new ReduxInterruptions(interruption);}
            });



            story = update(story, {interruptions: {$merge: map}, loaded: {$set: true}});
            team = update(team, {stories: {[action.storyId]: {$set:story}}});


            return update(user, {teams: {[action.teamId]: {$set: team}}});
        }
    }

    return user;
};