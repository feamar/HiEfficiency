import AbstractFirestoreDocument from "../firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentStory from "../firebase/firestore/documents/DocumentStory";
import ReduxInterruptions from "./ReduxInterruptions";
import DocumentInterruptions from "../firebase/firestore/documents/DocumentInterruptions";
import UtilityObject from "../../utilities/UtilityObject";

export type StoryLifecycle = "Unstarted" | "Uninterrupted" | "Interrupted" | "Finished";

export default class ReduxStory
{
    static default = () =>
    {   return new ReduxStory(new AbstractFirestoreDocument<DocumentStory>(DocumentStory.default(), null), {}, true);}

    public readonly document: AbstractFirestoreDocument<DocumentStory>;
    public readonly loaded: boolean;
    public readonly interruptions: {[id: string]: ReduxInterruptions}; //TODO: Rename to interruptions per user.

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
            console.log("GET LIFECYCLE: " + UtilityObject.stringify(this.interruptions));
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