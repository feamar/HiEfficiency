import AbstractReduxAction from "./AbstractReduxAction";
import { RNFirebase } from "react-native-firebase";

export default class ActionTeamDataChanged extends AbstractReduxAction
{
    static readonly TYPE = "action_team_data_change";

    readonly teamSnapshot: RNFirebase.firestore.DocumentSnapshot;

    constructor(teamSnapshot: RNFirebase.firestore.DocumentSnapshot)
    {
        super(ActionTeamDataChanged.TYPE);

        this.teamSnapshot = teamSnapshot;
    }
}