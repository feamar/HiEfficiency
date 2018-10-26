import { RNFirebase } from "react-native-firebase";
import EntitySchemaWeek from "../entities/EntitySchemaWeek";
import UtilityObject from "../../../../utilities/UtilityObject";
import ReduxStory from "../../../redux/ReduxStory";
import FirebaseAdapter from "../../../../components/firebase/FirebaseAdapter";
import UtilityArray from "../../../../utilities/UtilityArray";

export default class DocumentUser
{
    static fromSnapshot = (snapshot: RNFirebase.firestore.DocumentSnapshot) : DocumentUser | undefined =>
    {
        if(snapshot.exists == false)
        {   return undefined;}

        const document: DocumentUser = snapshot.data() as DocumentUser;
        document.uid = snapshot.id as string;
        document.weekSchema = EntitySchemaWeek.fromJsonObject(document.weekSchema);

        return document;
    }
    
    static getAllAsMap = async (story: ReduxStory): Promise<Map<string, DocumentUser>> =>
    {   return DocumentUser.asMap(await DocumentUser.getAllAsArray(story));}

    static getAllAsArray = async (story: ReduxStory): Promise<Array<DocumentUser>>  =>
    {
        const keys = Object.keys(story.interruptions);
        const promises = keys.map(async key => 
        {
            const document = await FirebaseAdapter.getUsers().doc(key).get();
            return DocumentUser.fromSnapshot(document);
        });
        const users = await Promise.all(promises);

        return UtilityArray.asDefinedType(users);
    }

    static asMap = (users: Array<DocumentUser>) =>
    {
        const map = new Map<string, DocumentUser>();
        users.forEach(user => 
        {   
            console.log("AS MAP: " + user.uid + " AND " + UtilityObject.stringify(user));
            map.set(user.uid, user);
        });

        return map;
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