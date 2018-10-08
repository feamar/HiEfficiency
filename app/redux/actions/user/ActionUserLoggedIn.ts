import AbstractReduxAction from "../AbstractReduxAction";
import AbstractFirestoreDocument from "../../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentUser from "../../../dtos/firebase/firestore/documents/DocumentUser";

export default class ActionUserLoggedIn extends AbstractReduxAction
{
    static readonly TYPE = "action_user_logged_in";

    readonly document: AbstractFirestoreDocument<DocumentUser>;

    constructor(document: AbstractFirestoreDocument<DocumentUser>)
    {
        super(ActionUserLoggedIn.TYPE);
        this.document = document;
    }
}