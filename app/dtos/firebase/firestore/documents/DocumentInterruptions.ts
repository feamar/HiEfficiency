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

    private mInterruptions: Array<EntityInterruption>;

    private constructor(interruptions: Array<EntityInterruption>)
    {
        this.mInterruptions = interruptions;
    }

    get interruptions () : Array<EntityInterruption>
    {   return this.mInterruptions;}

    addInterruption = (interruption: EntityInterruption) : boolean =>
    {
        if(this.interruptions.indexOf(interruption) >= 0)
        {   return false;}

        this.mInterruptions = update(this.mInterruptions, {$push: [interruption]});
        return true;
    }

    removeInterruption = (interruption: EntityInterruption) : boolean =>
    {
        const index = this.interruptions.indexOf(interruption);
        if(index < 0)
        {   return false;}

        this.mInterruptions = update(this.mInterruptions, {$splice: [[index, 1]]});
        return true;
    }
}