import AbstractReduxAction from "../AbstractReduxAction";

export default class ActionStoryDeleted extends AbstractReduxAction
{
    static readonly TYPE = "action_story_deleted;"

    public readonly teamId: string;
    public readonly storyId: string;

    constructor(teamId: string, storyId: string)
    {
        super(ActionStoryDeleted.TYPE);

        this.teamId = teamId;
        this.storyId = storyId
    }
}