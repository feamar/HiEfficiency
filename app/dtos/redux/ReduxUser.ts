import DocumentUser from "../firebase/firestore/documents/DocumentUser";
import AbstractFirestoreDocument from "../firebase/firestore/documents/AbstractFirestoreDocument";
import ReduxTeam from "./ReduxTeam";

export default class ReduxUser
{
    public readonly document: AbstractFirestoreDocument<DocumentUser>;
    public readonly teams: Map<string, ReduxTeam>;
    public readonly loaded: boolean;

    constructor(document: AbstractFirestoreDocument<DocumentUser>, teams: Map<string, ReduxTeam>, loaded: boolean)
    {
           this.document = document;
           this.teams = teams;
           this.loaded = loaded;
    }
}