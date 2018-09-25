import AbstractReduxAction from "./AbstractReduxAction";
import AbstractFirestoreDocument from "../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentTeam from "../../dtos/firebase/firestore/documents/DocumentTeam";

export default class ActionTeamDataChanged extends AbstractReduxAction
{
    static readonly TYPE = "action_team_data_change";

    readonly document: AbstractFirestoreDocument<DocumentTeam>;
    constructor(document: AbstractFirestoreDocument<DocumentTeam>)
    {
        super(ActionTeamDataChanged.TYPE);

        this.document = document;
    }
}