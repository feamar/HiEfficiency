import AbstractReduxAction from "../AbstractReduxAction";

export default class ActionStopInspectStory extends AbstractReduxAction
{
    static readonly TYPE = "action_stop_inspecting_story";

    constructor()
    {   super(ActionStopInspectStory.TYPE);}
} 