import UtilityObject from "../../utilities/UtilityObject";
import update from 'immutability-helper';

export const ACTION_TYPE_INSPECT_TEAM_START = "inspect_team_start";
export const ACTION_TYPE_INSPECT_TEAM_END = "inspect_team_end";

export const ACTION_TYPE_INSPECT_STORY_START = "inspect_story_start";
export const ACTION_TYPE_INSPECT_STORY_END = "inspect_story_end";

export const onInspectTeamStart = (teamId) =>
{
    return {
        type: ACTION_TYPE_INSPECT_TEAM_START,
        teamId: teamId
    }
}

export const onInspectTeamEnd = () =>
{
    return {
        type: ACTION_TYPE_INSPECT_TEAM_END,
    }
}

export const onInspectStoryStart = (storyId) =>
{
    return {
        type: ACTION_TYPE_INSPECT_STORY_START,
        storyId: storyId
    }
}

export const onInspectStoryEnd = () =>
{
    return {
        type: ACTION_TYPE_INSPECT_STORY_END,
    }
}

export default (inspecting = {}, action) => 
{
    var copy;
    switch(action.type)
    {
        case ACTION_TYPE_INSPECT_TEAM_START:
            copy = update(inspecting, {team: {$set: action.teamId}});
            return copy;

        case ACTION_TYPE_INSPECT_TEAM_END:
            copy = update(inspecting, {team: {$set: undefined}});
            return copy;

        case ACTION_TYPE_INSPECT_STORY_START:
            copy = update(inspecting, {story:{$set: action.storyId}});
            return copy;

        case ACTION_TYPE_INSPECT_STORY_END:
            copy = update(inspecting, {story: {$set: undefined}});
            return copy;

        default:
            return inspecting
    }
};