import { RNFirebase } from "react-native-firebase";
import EntitySchemaWeek from "../entities/EntitySchemaWeek";

export default class DocumentUser
{
    static fromSnapshot = (snapshot: RNFirebase.firestore.DocumentSnapshot) : DocumentUser | undefined =>
    {
        if(snapshot.exists == false)
        {   return undefined;}

        return snapshot.data() as DocumentUser;
    }
    
    public uid: string;
    public teams: Array<string>;
    public weekSchema: EntitySchemaWeek

    private constructor(uid: string, teams: Array<string>, weekSchema: EntitySchemaWeek = EntitySchemaWeek.default())
    {
        this.uid = uid;
        this.teams = teams;
        this.weekSchema = weekSchema;
    }
}