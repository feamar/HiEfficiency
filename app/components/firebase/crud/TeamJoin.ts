import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import AbstractCrudOperation from './AbstractCrudOperation';
import { RNFirebase } from 'react-native-firebase';
import DocumentTeam from '../../../dtos/firebase/firestore/documents/DocumentTeam';
import AbstractFirestoreDocument from '../../../dtos/firebase/firestore/documents/AbstractFirestoreDocument';
import ActionUserJoinedTeam from '../../../redux/actions/user/ActionUserJoinedTeam';

export default class TeamJoin extends AbstractCrudOperation
{
    private readonly name: string;
    private readonly code: string;
    private readonly userId: string;
    private readonly currentTeams: Array<string>;

    constructor(name: string, code: string, userId: string, currentTeams: Array<string>)
    {
        super("Please be patient while we try to join the team..");

        this.name = name;
        this.code = code;
        this.currentTeams = currentTeams;
        this.userId = userId;
    }

    onRollback = async (_: DialogLoading) =>
    {
        const user = FirebaseAdapter.getUsers().doc(this.userId);
        this.attemptRollback(0, 10, async () => 
        {   await user.update({teams: this.currentTeams});});
    }

    getMatch = (teams: RNFirebase.firestore.QuerySnapshot, code: string): AbstractFirestoreDocument<DocumentTeam> | undefined =>
    {
        for(var i = 0 ; i < teams.docs.length ; i ++)
        { 
            const document = teams.docs[i];
            const team = document.data() as DocumentTeam;

            if(team.code.toString() == code.toString())
            {   return new AbstractFirestoreDocument<DocumentTeam>(team, document.id!);}
        }

        return undefined;
    }


    perform = async (dialog: DialogLoading) => 
    {
        var teams: RNFirebase.firestore.QuerySnapshot;
        try
        {   teams = await FirebaseAdapter.getTeams().where("name", "==", this.name.toString()).get();}
        catch(error)
        {   
            this.onError(dialog, "Something went wrong while retrieving the teams, please try again later.", error);
            return;
        }
        
        if(dialog.isTimedOut())
        {   return;}

        const match = this.getMatch(teams, this.code);
        if(match == undefined)
        {
            if(teams.docs.length <= 0)
            {   this.onError(dialog, "No team called '" + this.name + "' could be found.");}
            else
            {   this.onError(dialog,  "A team called '" + this.name + "' could be found, but the security code was incorrect.");}
        }
        else
        {
            if (this.currentTeams.indexOf(match.id!) >= 0)
            {   this.onError(dialog, "You are already a member of this team, and you can not join a team twice.");}
            else
            {
                const newData = update(this.currentTeams, {$push: [match.id!]});
                try
                {
                    await this.sendUpdates(dialog, ActionUserJoinedTeam.TYPE, async () => 
                    {   await FirebaseAdapter.getUsers().doc(this.userId).update({teams: newData});});
    
                    this.onSuccess(dialog, "You have successfully joined the team.");
                }
                catch(error)
                {   this.onError(dialog, "Team could not be joined, please try again.", error);}
            }
        }
    }
}