import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update, { Spec } from "immutability-helper";
import AbstractCrudOperation from './AbstractCrudOperation';
import DocumentTeam from '../../../dtos/firebase/firestore/documents/DocumentTeam';
import ActionTeamDataChanged from '../../../redux/actions/user/ActionTeamDataChanged';

export default class TeamUpdate extends AbstractCrudOperation
{
    private readonly teamId: string;
    private readonly oldTeam: DocumentTeam;
    private readonly updates: Spec<DocumentTeam, never>;

    constructor(teamId: string, oldTeam: DocumentTeam, updates: Spec<DocumentTeam, never>)
    {
        super("Please be patient while we try to update the team..");

        this.teamId = teamId;
        this.oldTeam = oldTeam;
        this.updates = updates;
    }

    onRollback = async (_:DialogLoading) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getTeams().doc(this.teamId).set(this.oldTeam);});
    }

    perform = async (dialog: DialogLoading) => 
    {
        try 
        {
            const newTeam = update(this.oldTeam, this.updates);
            await this.sendUpdates(dialog, ActionTeamDataChanged.TYPE, async () => 
            {   await FirebaseAdapter.getTeams().doc(this.teamId).update(newTeam);});
            
            this.onSuccess(dialog, "Successfully updated the team.");
        }
        catch(error)
        {   this.onError(dialog, "Team could not be updated, please try again.", error);}
    }
}