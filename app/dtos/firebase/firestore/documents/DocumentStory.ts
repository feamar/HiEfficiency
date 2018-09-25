import { RNFirebase } from "react-native-firebase";

export default class DocumentStory
{
    static create(name: string, type: number)
    {   return new DocumentStory(name, type, new Date());}

    static fromSnapshot(snapshot: RNFirebase.firestore.DocumentSnapshot) : DocumentStory | undefined
    {
        if(snapshot.exists == false)
        {   return undefined;}

        return snapshot.data() as DocumentStory;
    }

    public createdOn: Date;
    public finishedOn?: Date;
    public startedOn?: Date;
    public name: string;
    public type: number;
    public upvotes: number;

    private constructor(name: string, type: number, createdOn: Date, upvotes: number = 0)
    {
        this.name = name;
        this.type = type;
        this.createdOn = createdOn;
        this.upvotes = upvotes;
    }
}