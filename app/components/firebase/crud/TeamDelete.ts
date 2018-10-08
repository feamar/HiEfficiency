import FirebaseAdapter from "../FirebaseAdapter";
import update from "immutability-helper";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import{ RNFirebase } from 'react-native-firebase';
import ActionUserLeftTeam from '../../../redux/actions/user/ActionUserLeftTeam';
import ActionTeamDeleted from '../../../redux/actions/user/ActionTeamDeleted';

export default class TeamDelete extends AbstractCrudOperation
{
    private readonly teamId: string;
    private readonly userId: string;
    private readonly currentTeams: Array<string>; 
    private oldTeam?: RNFirebase.firestore.DocumentSnapshot;

    constructor(teamId: string, userId: string, currentTeams: Array<string>)
    {
        super("Please be patient while we try to delete the team..");

        this.teamId = teamId;
        this.currentTeams = currentTeams;
        this.userId = userId;
    }

    onRollback = async (_: Updatable) =>
    {
        console.log("ROLLING BACK CHANGES!");
        const user = FirebaseAdapter.getUsers().doc(this.userId);
        if(this.oldTeam)
        {
            const data = this.oldTeam.data(); 
            const newTeam: RNFirebase.firestore.DocumentReference = await this.attemptRollback(0, 10, async () => 
            {   
                if(data != undefined)
                {   return await FirebaseAdapter.getTeams().add(data);}

                throw Error();
            })!;

            const index = this.currentTeams.indexOf(this.teamId);
            var oldTeams: Array<string>;
            if(index >= 0)
            {   oldTeams = update(this.currentTeams, {$splice: [[index, 1, newTeam.id!]]});}
            else
            {   oldTeams = update(this.currentTeams, {$push: [newTeam.id!]});}

            this.attemptRollback(0, 10, async () => 
            {   await user.update({teams: oldTeams});});
        }
        else
        {
            this.attemptRollback(0, 10, async () => 
            {   await user.update({teams: this.currentTeams});});
        }
    }

    perform = async (updatable: Updatable) => 
    {
        const index = this.currentTeams.indexOf(this.teamId);
        //console.log("Index; " + index + ", teamId: " + this.teamId + " and currentTeams: " + UtilityObject.stringify(this.currentTeams));
        if(index >= 0)
        {   
            try
            {
                const newData = update(this.currentTeams, {$splice: [[index, 1]]});
                await this.sendUpdates(updatable, ActionUserLeftTeam.TYPE, async () => 
                {   await FirebaseAdapter.getUsers().doc(this.userId).update({teams: newData});});
            }
            catch(error)
            {   
                this.onError(updatable, "Something went wrong while leaving the team.", error);
                return;
            }

            if(updatable.isTimedOut())
            {   return;}
        }

        const stories = await FirebaseAdapter.getStories(this.teamId).get();
        const promises = stories.docs.map(async (story) => 
        {
            const interruptions = await FirebaseAdapter.getInterruptionsFromStoryRef(story.ref).get();
            await Promise.all(interruptions.docs.map(interruption => 
            {   return interruption.ref.delete();}));

            return story.ref.delete();
        });

        await Promise.all(promises);

        try
        {
            const doc = FirebaseAdapter.getTeams().doc(this.teamId);
            this.oldTeam = await doc.get();

            await this.sendUpdates(updatable, ActionTeamDeleted.TYPE, async () => 
            {   await doc.delete();});

            this.onSuccess(updatable, "You have successfully left and deleted the team.");
        }
        catch(error)
        {   this.onError(updatable, "Team could not be deleted, please try again.", error);}
    }
}