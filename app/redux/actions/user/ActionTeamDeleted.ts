import AbstractReduxAction from "../AbstractReduxAction";

export default class ActionTeamDeleted extends AbstractReduxAction
{
    static readonly TYPE = "action_team_deleted";

    readonly teamId: string;

    constructor(teamId: string)
    {
        super(ActionTeamDeleted.TYPE);

        this.teamId = teamId;
    }
}