import AbstractReduxAction from "./AbstractReduxAction";
import { RNFirebase } from "react-native-firebase";
import update from "immutability-helper";

export default class ActionStoriesLoaded extends AbstractReduxAction
{
    static readonly TYPE = "action_stories_loaded";

    readonly teamId: string;
    readonly changes: RNFirebase.firestore.DocumentChange[];

    constructor(teamId: string, changes: RNFirebase.firestore.DocumentChange[])
    {
        super(ActionStoriesLoaded.TYPE);

        this.teamId = teamId;
        this.changes = changes;

        const docs = changes.reduce((prev, current, _) => 
        {   
            const data = current.doc.data();
            return update(prev, {[current.doc.id]: {$set: {data: data, id: current.doc.id, interruptions: [], loaded: false}}});
        }, {});
    }
}