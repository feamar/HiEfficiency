import AbstractFirestoreDocument from "../firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentTeam from "../firebase/firestore/documents/DocumentTeam";
import ReduxStory from "./ReduxStory";

export default class ReduxTeam
{
    public readonly document: AbstractFirestoreDocument<DocumentTeam>;
    public readonly loaded: boolean;
    public readonly stories: {[id: string]: ReduxStory};

    constructor(document: AbstractFirestoreDocument<DocumentTeam>, stories: {[id: string]: ReduxStory}, loaded: boolean)
    {
        this.document = document;
        this.loaded = loaded;
        this.stories = stories;
    }
}