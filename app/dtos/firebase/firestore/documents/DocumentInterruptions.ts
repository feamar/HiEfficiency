import update from "immutability-helper";
import { RNFirebase } from "react-native-firebase";
import EntityInterruption from "../entities/EntityInterruption";
import ReduxInterruptions from "../../../redux/ReduxInterruptions";

export default class DocumentInterruptions 
{
    static create = (interruptions: Array<EntityInterruption> = []) : DocumentInterruptions =>
    {   return new DocumentInterruptions(interruptions);}

    static fromSnapshot = (snapshot: RNFirebase.firestore.DocumentSnapshot) : DocumentInterruptions | undefined =>
    {
        if(snapshot.exists == false)
        {   return undefined;}

        const document: DocumentInterruptions = snapshot.data() as DocumentInterruptions;
        document.interruptions = document.interruptions.map(interruption => EntityInterruption.fromJsonObject(interruption));

        return document;
    }

    static fromReduxInterruptions = (reduxInterruptions: {[id: string]: ReduxInterruptions}, userId: string): DocumentInterruptions =>
    {
        const ofUser = reduxInterruptions[userId];
        if(ofUser == undefined)
        {
            return DocumentInterruptions.create();
        }
        return new DocumentInterruptions(ofUser.document.data.interruptions);
    }

    public interruptions: Array<EntityInterruption>;

    private constructor(interruptions: Array<EntityInterruption>)
    {
        this.interruptions = interruptions;
    }

    addInterruption = (interruption: EntityInterruption) : boolean =>
    {
        if(this.interruptions.indexOf(interruption) >= 0)
        {   return false;}

        this.interruptions = update(this.interruptions, {$push: [interruption]});
        return true;
    }

    getLastInterruption = (): EntityInterruption | undefined =>
    {
        if(this.interruptions.length == 0)
        {   return undefined;}

        return this.interruptions[this.interruptions.length - 1];
    }

    getFirstInterruption = (): EntityInterruption | undefined =>
    {
        if(this.interruptions.length == 0)
        {   return undefined;}

        return this.interruptions[0];
    }

    addInterruptionImmutable = (interruption: EntityInterruption) : DocumentInterruptions =>
    {   return new DocumentInterruptions([...this.interruptions, interruption]);}

    removeInterruption = (interruption: EntityInterruption) : boolean =>
    {
        const index = this.interruptions.indexOf(interruption);
        if(index < 0)
        {   return false;}

        this.interruptions = update(this.interruptions, {$splice: [[index, 1]]});
        return true;
    }

    removeInterruptionImmutable = (interruption: EntityInterruption) : DocumentInterruptions =>
    {
        const updated = new DocumentInterruptions(this.interruptions);
        updated.removeInterruption(interruption);
        return updated;
    }

    replaceInterruption = (oldInterruption: EntityInterruption, newInterruption: EntityInterruption): boolean =>
    {
        const index = this.interruptions.indexOf(oldInterruption);
        if(index < 0)
        {   return false;}

        this.interruptions = update(this.interruptions, {$splice: [[index, 1, newInterruption]]});
        return true;
    }

    replaceInterruptionImmutable = (oldInterruption: EntityInterruption, newInterruption: EntityInterruption): DocumentInterruptions =>
    {
        const updated = new DocumentInterruptions(this.interruptions);
        updated.replaceInterruption(oldInterruption, newInterruption);
        return updated;
    }
}