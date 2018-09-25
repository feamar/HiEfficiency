import AbstractReduxAction from "./AbstractReduxAction";
import { RNFirebase } from "react-native-firebase";

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
    }
}