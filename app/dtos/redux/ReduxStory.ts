import AbstractFirestoreDocument from "../firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentStory from "../firebase/firestore/documents/DocumentStory";
import ReduxInterruptions from "./ReduxInterruptions";
import DocumentInterruptions from "../firebase/firestore/documents/DocumentInterruptions";

export type StoryLifecycle = "Unstarted" | "Uninterrupted" | "Interrupted" | "Finished";

export default class ReduxStory
{
    public readonly document: AbstractFirestoreDocument<DocumentStory>;
    public readonly loaded: boolean;
    public readonly interruptions: {[id: string]: ReduxInterruptions};

    constructor(document: AbstractFirestoreDocument<DocumentStory>, interruptions: {[id: string]: ReduxInterruptions}, loaded: boolean){
        this.document = document;
        this.loaded = loaded;
        this.interruptions = interruptions;
    }

    getLifeCycle = (uid: string): StoryLifecycle =>
    {
        const data = this.document.data;
        if(data.startedOn == undefined)
        {   return "Unstarted";}
        else if (data.finishedOn != undefined)
        {   return "Finished";}
        else 
        {
            const document = DocumentInterruptions.fromReduxInterruptions(this.interruptions, uid);
            if(document.interruptions.length == 0)
            {   return "Uninterrupted";}

            const last = document.getLastInterruption();
            if(last == undefined || last.duration != undefined)
            {   return "Uninterrupted";}
            else
            {   return "Interrupted";}
        }
    }
    
}