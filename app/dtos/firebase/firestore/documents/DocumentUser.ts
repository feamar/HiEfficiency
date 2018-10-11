import { RNFirebase } from "react-native-firebase";
import EntitySchemaWeek from "../entities/EntitySchemaWeek";
import UtilityObject from "../../../../utilities/UtilityObject";

export default class DocumentUser
{
    static fromSnapshot = (snapshot: RNFirebase.firestore.DocumentSnapshot) : DocumentUser | undefined =>
    {
        if(snapshot.exists == false)
        {   return undefined;}

        const document: DocumentUser = snapshot.data() as DocumentUser;
        console.log("USER HER!: "+ UtilityObject.stringify(document));
        document.weekSchema = EntitySchemaWeek.fromJsonObject(document.weekSchema);

        console.log("USER HERE: " + UtilityObject.stringify(document));
        return document;
    }

    public uid: string;
    public teams: Array<string>;
    public weekSchema: EntitySchemaWeek
    public name: string;
    public initials: string;

    private constructor(uid: string, teams: Array<string>, name: string, initials: string, weekSchema: EntitySchemaWeek = EntitySchemaWeek.default())
    {
        this.uid = uid;
        this.initials = initials;
        this.teams = teams;
        this.weekSchema = weekSchema;
        this.name = name;
    }
}