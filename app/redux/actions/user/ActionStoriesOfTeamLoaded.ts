import AbstractReduxAction from "../AbstractReduxAction";
import AbstractFirestoreDocument from "../../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentStory from "../../../dtos/firebase/firestore/documents/DocumentStory";

export default class ActionStoriesOfTeamLoaded extends AbstractReduxAction
{
    static readonly TYPE = "action_stories_of_team_loaded";

    public readonly stories: Array<AbstractFirestoreDocument<DocumentStory>>;
    public readonly teamId: string;

    constructor(teamId: string, stories: Array<AbstractFirestoreDocument<DocumentStory>>)
    {
        super(ActionStoriesOfTeamLoaded.TYPE);

        this.teamId = teamId;
        this.stories = stories;
    }
}