import AbstractReduxAction from "../AbstractReduxAction";

export default class ActionStartInspectTeam extends AbstractReduxAction
{
    static readonly TYPE = "action_start_inspecting_team";

    public readonly teamId: string;

    constructor(teamId: string)
    {
        super(ActionStartInspectTeam.TYPE);

        this.teamId = teamId;
    }
} 