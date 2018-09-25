import EntityInterruption from "./EntityInterruption";
import update from "immutability-helper";
import { RNFirebase } from "react-native-firebase";

export default class EntityInterruptions 
{
    static create = (interruptions: ReadonlyArray<EntityInterruption> = []) : EntityInterruptions =>
    {   return new EntityInterruptions(interruptions);}

    static fromSnapshot = (snapshot: RNFirebase.firestore.DocumentSnapshot) : EntityInterruptions | undefined =>
    {
        if(snapshot.exists == false)
        {   return undefined;}

        return snapshot.data() as EntityInterruptions;
    }

    readonly interruptions: ReadonlyArray<EntityInterruption>;

    private constructor(interruptions: ReadonlyArray<EntityInterruption>)
    {
        this.interruptions = interruptions;
    }

    addInterruption = (interruption: EntityInterruption) : EntityInterruptions =>
    {
        if(this.interruptions.indexOf(interruption) >= 0)
        {   return this;}

        const updated = update(this.interruptions, {$push: [interruption]});
        const result: EntityInterruptions = EntityInterruptions.create(updated);

        return result
    }
}