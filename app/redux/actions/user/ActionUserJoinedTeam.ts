import AbstractReduxAction from "./AbstractReduxAction";
import DocumentTeam from "../../../dtos/firebase/firestore/documents/DocumentTeam";
import AbstractFirestoreDocument from "../../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";

export default class ActionUserJoinedTeam extends AbstractReduxAction
{
    static readonly TYPE = "action_user_joined_team";

    readonly document: AbstractFirestoreDocument<DocumentTeam>;

    constructor(document: AbstractFirestoreDocument<DocumentTeam>)
    {
        super(ActionUserJoinedTeam.TYPE);

        this.document = document;
    }
}