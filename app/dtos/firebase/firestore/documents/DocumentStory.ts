import { RNFirebase } from "react-native-firebase";
import DocumentUser from "./DocumentUser";
import FirebaseAdapter from "../../../../components/firebase/FirebaseAdapter";

export default class DocumentStory
{
    static default = (reporter: DocumentUser) =>
    {   return new DocumentStory("", 0, new Date(), reporter, 0);}
    
    static create(name: string, type: number, reporter: DocumentUser)
    {   return new DocumentStory(name, type, new Date(), reporter);}

    static fromSnapshot(snapshot: RNFirebase.firestore.DocumentSnapshot) : DocumentStory | undefined
    {
        if(snapshot.exists == false)
        {   return undefined;}

        const json = snapshot.data() as any;
        var document = new DocumentStory(json.name, json.type, json.createdOn, undefined, json.upvotes);
        document.finishedOn = json.finishedOn;
        document.startedOn = json.startedOn;
        document.description = json.description;
        document.points = json.points;
        document.reporter = json.reporter;
        
        return document;
    }

    public createdOn: Date;
    public finishedOn?: Date;
    public startedOn?: Date;
    public name: string;
    public type: number;
    public upvotes: number;
    public description?: string;
    public points?: number;
    public reporter?: string;


    private constructor(name: string, type: number, createdOn: Date, reporter?: DocumentUser, upvotes: number = 0)
    {
        if(reporter)
        {   this.reporter = reporter.uid;}
        this.name = name;
        this.type = type;
        this.createdOn = createdOn;
        this.upvotes = upvotes;
    }

    public getReporterDocument = async () =>
    {
        if(this.reporter == undefined)
        {   return undefined;}

        return DocumentStory.fromSnapshot(await FirebaseAdapter.getUsers().doc(this.reporter).get());
    }
}