import FirebaseAdapter from "../FirebaseAdapter";
import update from "immutability-helper";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import DocumentTeam from '../../../dtos/firebase/firestore/documents/DocumentTeam';
import { RNFirebase } from 'react-native-firebase';
import ActionUserJoinedTeam from '../../../redux/actions/user/ActionUserJoinedTeam';
import ActionStoriesOfTeamLoaded from "../../../redux/actions/user/ActionStoriesOfTeamLoaded";

export default class TeamCreate extends AbstractCrudOperation
{
    private readonly team: DocumentTeam;
    private readonly userId: string;
    private readonly currentTeams: Array<string>;
    private newDocument?: RNFirebase.firestore.DocumentReference;

    constructor(team: DocumentTeam, userId: string, currentTeams: Array<string>)
    {
        super("Please be patient while we try to create the team..");

        this.team = team;
        this.currentTeams = currentTeams;
        this.userId = userId;
    }

    onRollback = async (_: Updatable) =>
    {
        if(this.newDocument != undefined)
        {
            const user = FirebaseAdapter.getUsers().doc(this.userId);
            this.attemptRollback(0, 10, async () =>
            {   await user.update({teams: this.currentTeams});});

            this.attemptRollback(0, 10, async () => 
            {
                if(this.newDocument != undefined)
                {   await this.newDocument.delete();}
            });
        }
    }

    perform = async (updatable: Updatable) => 
    {
        this.newDocument = await this.sendUpdates(updatable, ActionStoriesOfTeamLoaded.TYPE, async () => 
        {   return await FirebaseAdapter.getTeams().add(this.team);});

        if(updatable.isTimedOut())
        {   return;}

        if(this.newDocument == undefined)
        {   throw new Error("Fatal stat exception.");}

        updatable.setMessage("Team created, now joining new team.");
        const newData = update(this.currentTeams, {$push: [this.newDocument.id!]});
        try
        {
            await this.sendUpdates(updatable, ActionUserJoinedTeam.TYPE, async () => 
            {   await FirebaseAdapter.getUsers().doc(this.userId).update({teams: newData});});

            this.onSuccess(updatable, "You have successfully created and joined the new team.");
        }
        catch(error)
        {   this.onError(updatable, "Team could not be created, please try again.", error);}
    }
}