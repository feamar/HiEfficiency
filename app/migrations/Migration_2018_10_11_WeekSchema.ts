import AbstractMigration from "./AbstractMigration";
import FirebaseAdapter from "../components/firebase/FirebaseAdapter";
import { RNFirebase } from "react-native-firebase";
import EntitySchemaWeek from "../dtos/firebase/firestore/entities/EntitySchemaWeek";
import EntitySchemaDay from "../dtos/firebase/firestore/entities/EntitySchemaDay";

export default class Migration_2018_10_11_WeekSchema extends AbstractMigration
{
    private uid: string;
    constructor(uid: string)
    {
        super();
        this.uid = uid;
    }

    perform = async () =>
    {
        const document: RNFirebase.firestore.DocumentSnapshot = await FirebaseAdapter.getUsers().doc(this.uid).get();
        const data = document.data() as any;

        //If the weekschema wasn't filled in in the first place, we've got nothing to do.
        if(data == undefined || data.weekSchema == undefined)
        {   return;}

        //Determine if the weekschema is in the old format.
        if(Array.isArray(data.weekSchema) == false)
        {   return;}

        if(data.weekSchema.length != 7)
        {   return;} 
        
        const first = data.weekSchema[0];
        if(first[0] == undefined && first[1] == undefined && first["enabled"] == undefined)
        {   return;}

        //Iterate all seven days and re-store them as EntitySchemaWeek's.
        const monday = EntitySchemaDay.create(data.weekSchema[0][0], data.weekSchema[0][1], data.weekSchema[0].enabled);
        const tuesday = EntitySchemaDay.create(data.weekSchema[1][0], data.weekSchema[1][1], data.weekSchema[1].enabled);
        const wednesday = EntitySchemaDay.create(data.weekSchema[2][0], data.weekSchema[2][1], data.weekSchema[2].enabled);
        const thursday = EntitySchemaDay.create(data.weekSchema[3][0], data.weekSchema[3][1], data.weekSchema[3].enabled);
        const friday = EntitySchemaDay.create(data.weekSchema[4][0], data.weekSchema[4][1], data.weekSchema[4].enabled);
        const saturday = EntitySchemaDay.create(data.weekSchema[5][0], data.weekSchema[5][1], data.weekSchema[5].enabled);
        const sunday = EntitySchemaDay.create(data.weekSchema[6][0], data.weekSchema[6][1], data.weekSchema[6].enabled);
        
        const schema = EntitySchemaWeek.fromDays(monday, tuesday, wednesday, thursday, friday, saturday, sunday);
        document.ref.update({weekSchema: schema});
    }
}