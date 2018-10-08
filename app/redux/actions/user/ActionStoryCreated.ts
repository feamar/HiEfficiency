import AbstractReduxAction from "../AbstractReduxAction";
import AbstractFirestoreDocument from "../../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentStory from "../../../dtos/firebase/firestore/documents/DocumentStory";

export default class ActionStoryCreated extends AbstractReduxAction
{
    static readonly TYPE = "action_story_created";

    public readonly document: AbstractFirestoreDocument<DocumentStory>;
    public readonly teamId: string;

    constructor(teamId: string, document: AbstractFirestoreDocument<DocumentStory>)
    {
        super(ActionStoryCreated.TYPE);

        this.teamId = teamId;
        this.document = document;
    }
}