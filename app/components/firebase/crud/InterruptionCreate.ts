import FirebaseAdapter from "../FirebaseAdapter";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import DocumentInterruptions from "../../../dtos/firebase/firestore/documents/DocumentInterruptions";
import EntityInterruption from "../../../dtos/firebase/firestore/entities/EntityInterruption";
import ActionInterruptionsOfStoryLoaded from "../../../redux/actions/user/ActionInterruptionsOfStoryLoaded";

export default class InterruptionCreate extends AbstractCrudOperation
{
    private teamId: string;
    private storyId: string;
    private userId: string;
    private currentInterruptions: DocumentInterruptions;
    private newInterruption: EntityInterruption;

    constructor(teamId: string, storyId: string, userId: string, currentInterruptions: DocumentInterruptions, newInterruption: EntityInterruption)
    {
        super("Please be patient while we try to create the interruption..");

        this.teamId = teamId;
        this.storyId = storyId;
        this.userId = userId;
        this.currentInterruptions = currentInterruptions;
        this.newInterruption = newInterruption;
    }

    onRollback = async (_: Updatable) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId).set(this.currentInterruptions);});   
    }

    perform = async (updatable: Updatable) => 
    {
        const document = FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId);
        const newInterruptions = this.currentInterruptions.addInterruptionImmutable(this.newInterruption);

        try
        {
            var closure = undefined;
            const snapshot = await document.get();
            if(snapshot.exists)
            {
                closure = async () => 
                {   await document.update(newInterruptions);};
            }
            else
            {   
                closure = async () => 
                {   await document.set(newInterruptions);};
            }

            await this.sendUpdates(updatable, ActionInterruptionsOfStoryLoaded.TYPE, closure);
            this.onSuccess(updatable, "Successfully created interruption.");
        }
        catch(error) 
        {   this.onError(updatable, "Something went wrong while creating the interruption, please try again.", error);}
    }

}