import AbstractReduxAction from "../AbstractReduxAction";

export default class ActionUserLeftTeam extends AbstractReduxAction
{
    static readonly TYPE = "action_user_left_team";

    readonly leftTeamId: string;

    constructor(leftTeamId: string)
    {
        super(ActionUserLeftTeam.TYPE);
        this.leftTeamId = leftTeamId;
    }
}