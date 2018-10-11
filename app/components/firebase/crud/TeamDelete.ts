import FirebaseAdapter from "../FirebaseAdapter";
import update from "immutability-helper";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import ActionUserLeftTeam from '../../../redux/actions/user/ActionUserLeftTeam';
import ActionTeamDeleted from '../../../redux/actions/user/ActionTeamDeleted';

export default class TeamDelete extends AbstractCrudOperation
{
    private readonly teamId: string;
    private readonly userId: string;
    private readonly currentTeams: Array<string>; 

    constructor(teamId: string, userId: string, currentTeams: Array<string>)
    {
        super("Please be patient while we try to delete the team..");

        this.teamId = teamId;
        this.currentTeams = currentTeams;
        this.userId = userId;
    }

    onRollback = async (_: Updatable) =>
    {
        /*console.log("ROLLING BACK CHANGES!");
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
        }*/
    }

    perform = async (updatable: Updatable) => 
    {
        console.log("TeamDelete 1");
        const index = this.currentTeams.indexOf(this.teamId);
        //console.log("Index; " + index + ", teamId: " + this.teamId + " and currentTeams: " + UtilityObject.stringify(this.currentTeams));
        if(index >= 0)
        {   
        console.log("TeamDelete 2");

            try
            {
                console.log("TeamDelete 3");
                const newData = update(this.currentTeams, {$splice: [[index, 1]]});
                console.log("TeamDelete 4");
                await this.sendUpdates(updatable, ActionUserLeftTeam.TYPE, async () => 
                {   await FirebaseAdapter.getUsers().doc(this.userId).update({teams: newData});});
                console.log("TeamDelete 5");
            }
            catch(error)
            {   
                console.log("TeamDelete 6");
                this.onError(updatable, "Something went wrong while leaving the team.", error);
                return;
            }

            console.log("TeamDelete 7");
            if(updatable.isTimedOut())
            {   return;}
        }

        console.log("TeamDelete 8");
        const stories = await FirebaseAdapter.getStories(this.teamId).get();
        console.log("TeamDelete 9");
        const promises = stories.docs.map(async (story) => 
        {
            console.log("TeamDelete 10");
            const interruptions = await FirebaseAdapter.getInterruptionsFromStoryRef(story.ref).get();
            console.log("TeamDelete 11");
            await Promise.all(interruptions.docs.map(interruption => 
            {   return interruption.ref.delete();}));

            console.log("TeamDelete 12");
            return story.ref.delete();
        });

        console.log("TeamDelete 13");
        await Promise.all(promises);
        console.log("TeamDelete 14");

        try
        {
            console.log("TeamDelete 15");
            const doc = FirebaseAdapter.getTeams().doc(this.teamId);

            console.log("TeamDelete 16");
            await this.sendUpdates(updatable, ActionTeamDeleted.TYPE, async () => 
            {   await doc.delete();});

            console.log("TeamDelete 17");
            this.onSuccess(updatable, "You have successfully left and deleted the team.");
        }
        catch(error)
        {
            console.log("TeamDelete 18");
            this.onError(updatable, "Team could not be deleted, please try again.", error);
        }
    }
}