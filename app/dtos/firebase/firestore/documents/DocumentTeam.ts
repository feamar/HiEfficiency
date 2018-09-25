import { RNFirebase } from "react-native-firebase";

export default class EntityTeam 
{
    static create(code: string, name: string, dateOfFirstSprint?: Date)
    {   return new EntityTeam(code, name, dateOfFirstSprint);}

    static fromSnapshot(snapshot: RNFirebase.firestore.DocumentSnapshot) : EntityTeam | undefined
    {
        if(snapshot.exists == false)
        {   return undefined;}

        return snapshot.data() as EntityTeam;
    }

    readonly code: string;
    readonly name: string;
    readonly dateOfFirstSprint?: Date;

    private constructor(code: string, name: string, dateOfFirstSprint?: Date)
    {
        this.code = code;
        this.name = name;
        this.dateOfFirstSprint = dateOfFirstSprint;
    }
}