import update from "immutability-helper";
import { RNFirebase } from "react-native-firebase";
import EntityInterruption from "../entities/EntityInterruption";

export default class DocumentInterruptions 
{
    static create = (interruptions: Array<EntityInterruption> = []) : DocumentInterruptions =>
    {   return new DocumentInterruptions(interruptions);}

    static fromSnapshot = (snapshot: RNFirebase.firestore.DocumentSnapshot) : DocumentInterruptions | undefined =>
    {
        if(snapshot.exists == false)
        {   return undefined;}

        return snapshot.data() as DocumentInterruptions;
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