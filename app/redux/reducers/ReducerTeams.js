import UtilityObject from "../../utilities/UtilityObject";

export const ACTION_TYPE_TEAM_DELETED = "team_deleted";
export const ACTION_TYPE_TEAM_DATA_CHANGED = "team_data_changed";

export const onTeamDeleted = (teamId, teamSnapshot) =>
{
    return {
        type: ACTION_TYPE_TEAM_DELETED,
        snapshot: teamSnapshot,
        uid: teamId
    }
}

export const onTeamDataChanged = (teamSnapshot) =>
{
    return {
        type: ACTION_TYPE_TEAM_DATA_CHANGED,
        snapshot: teamSnapshot
    }
}

export default (t = {}, action) => 
{
    const copy = {...user}; 
    switch(action.type)
    {
        case ACTION_TYPE_USER_LOGGED_IN:
            copy.uid = action.uid;
            copy.data = action.snapshot.data();
            return copy;

        case ACTION_TYPE_USER_DATA_CHANGED:
            copy.data = action.snapshot.data();
            return copy;

        case ACTION_TYPE_USER_LOGGED_OUT:
            return null;

        default:
            return user
    }
};