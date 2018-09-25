import AbstractReduxAction from "./AbstractReduxAction";
import AbstractFirestoreDocument from "../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentUser from "../../dtos/firebase/firestore/documents/DocumentUser";

export default class ActionUserDataChanged extends AbstractReduxAction
{
    static readonly TYPE = "action_user_data_change";

    readonly document: AbstractFirestoreDocument<DocumentUser>;

    constructor(document: AbstractFirestoreDocument<DocumentUser>)
    {
        super(ActionUserDataChanged.TYPE);
        this.document = document;
    }
}