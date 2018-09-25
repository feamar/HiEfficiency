import AbstractReduxAction from "../AbstractReduxAction";

export default class ActionStopInspectTeam extends AbstractReduxAction
{
    static readonly TYPE = "action_stop_inspecting_team";

    constructor()
    {   super(ActionStopInspectTeam.TYPE);}
} 