import AbstractFirestoreDocument from "../firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentInterruptions from "../firebase/firestore/documents/DocumentInterruptions";

export default class ReduxInterruptions
{
    public readonly document: AbstractFirestoreDocument<DocumentInterruptions>;

    constructor(document: AbstractFirestoreDocument<DocumentInterruptions>)
    {   this.document = document;}
}