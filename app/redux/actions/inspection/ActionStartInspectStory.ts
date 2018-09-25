import AbstractReduxAction from "../AbstractReduxAction";

export default class ActionStartInspectStory extends AbstractReduxAction
{
    static readonly TYPE = "action_start_inspecting_story";

    public readonly storyId: string;

    constructor(storyId: string)
    {
        super(ActionStartInspectStory.TYPE);

        this.storyId = storyId;
    }
} 