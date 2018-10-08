import AbstractReduxAction from "../AbstractReduxAction";
import DocumentInterruptions from "../../../dtos/firebase/firestore/documents/DocumentInterruptions";
import AbstractFirestoreDocument from "../../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";

export default class ActionInterruptionsOfStoryLoaded extends AbstractReduxAction
{
    static readonly TYPE = "action_interruptions_of_story_loaded";

    public readonly interruptions: Array<AbstractFirestoreDocument<DocumentInterruptions>>;
    public readonly teamId: string;
    public readonly storyId: string;

    constructor(teamId: string, storyId: string, interruptions: Array<AbstractFirestoreDocument<DocumentInterruptions>>)
    {
        super(ActionInterruptionsOfStoryLoaded.TYPE);

        this.teamId = teamId;
        this.storyId = storyId;
        this.interruptions = interruptions;
    }

}