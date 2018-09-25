import AbstractReduxAction from "./AbstractReduxAction";
import AbstractFirestoreDocument from "../../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentStory from "../../../dtos/firebase/firestore/documents/DocumentStory";

export default class ActionStoryDataChanged extends AbstractReduxAction
{
    static readonly TYPE = "action_story_data_changed";

    public readonly teamId: string;
    public readonly document: AbstractFirestoreDocument<DocumentStory>;

    constructor(teamId: string, document: AbstractFirestoreDocument<DocumentStory>)
    {
        super(ActionStoryDataChanged.TYPE);

        this.teamId = teamId;
        this.document = document;
    }
}