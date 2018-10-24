import FirebaseAdapter from "../FirebaseAdapter";
import update from "immutability-helper";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import ActionUserLeftTeam from '../../../redux/actions/user/ActionUserLeftTeam';

export default class TeamLeave extends AbstractCrudOperation
{
    private readonly teamId: string;
    private readonly userId: string;
    private readonly currentTeams: Array<string>;

    constructor(teamId: string, userId: string, currentTeams: Array<string>)
    {
        super("Please be patient while we try to leave the team..");

        this.teamId = teamId;
        this.currentTeams = currentTeams;
        this.userId = userId;
    }

    onRollback = async (_: Updatable) =>
    {
        const user = FirebaseAdapter.getUsers().doc(this.userId);
        this.attemptRollback(0, 10, async () => 
        {   await user.update({teams: this.currentTeams});});
    }

    perform = async (updatable: Updatable) => 
    {
        var index: number = this.currentTeams.indexOf(this.teamId);
        if(index > -1)
        {
            const newTeams = update(this.currentTeams, {$splice: [[index, 1]]})
            try
            {
                await this.sendUpdates(updatable, ActionUserLeftTeam.TYPE, async () => 
                {   await FirebaseAdapter.getUsers().doc(this.userId).update({ teams: newTeams });});

                this.onSuccess(updatable, "You have successfully left the team.");
            }
            catch(error)
            {   this.onError(updatable, "Team could not be left, please try again.", error);}
        }
        else
        {   this.onError(updatable, "It appears you are somehow already not a member of this team.");}
    }
}