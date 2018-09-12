import UtilityObject from "../../utilities/UtilityObject";

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
    //console.log("INSPECTING REDUCER: " + action.type);

    const copy = {...inspecting}; 
    switch(action.type)
    {
        case ACTION_TYPE_INSPECT_TEAM_START:
            copy.team = action.teamId;
            return copy;

        case ACTION_TYPE_INSPECT_TEAM_END:
            copy.team = undefined;
            return copy;

        case ACTION_TYPE_INSPECT_STORY_START:
            copy.story = action.storyId;
            return copy;

        case ACTION_TYPE_INSPECT_STORY_END:
            copy.story = undefined;
            return copy;

        default:
            return inspecting
    }
};