import AbstractFirestoreDocument from "../firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentStory from "../firebase/firestore/documents/DocumentStory";
import ReduxInterruptions from "./ReduxInterruptions";

export default class ReduxStory
{
    public readonly document: AbstractFirestoreDocument<DocumentStory>;
    public readonly loaded: boolean;
    public readonly interruptions: Map<string, ReduxInterruptions>;

    constructor(document: AbstractFirestoreDocument<DocumentStory>, interruptions: Map<string, ReduxInterruptions>, loaded: boolean){
        this.document = document;
        this.loaded = loaded;
        this.interruptions = interruptions;
    }
}