import { RNFirebase } from "react-native-firebase";

export default class DocumentTeam 
{
    static create(code: string, name: string, dateOfFirstSprint?: Date)
    {   return new DocumentTeam(code, name, dateOfFirstSprint);}

    static empty()
    {   return new DocumentTeam("" , "");}

    static fromSnapshot(snapshot: RNFirebase.firestore.DocumentSnapshot) : DocumentTeam | undefined
    {
        if(snapshot.exists == false)
        {   return undefined;}

        
        const json = snapshot.data() as any;
        const document = new DocumentTeam(json.code, json.name, json.dateOfFirstSprint);
        return document;
    }

    public code: string;
    public name: string;
    public dateOfFirstSprint?: Date;

    private constructor(code: string, name: string, dateOfFirstSprint?: Date)
    {
        this.code = code;
        this.name = name;
        this.dateOfFirstSprint = dateOfFirstSprint;
    }
}