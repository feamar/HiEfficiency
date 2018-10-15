import FirebaseAdapter from "../FirebaseAdapter";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import DocumentInterruptions from '../../../dtos/firebase/firestore/documents/DocumentInterruptions';
import ActionInterruptionsOfStoryLoaded from "../../../redux/actions/user/ActionInterruptionsOfStoryLoaded";

export default class InterruptionDelete extends AbstractCrudOperation
{
    private readonly teamId: string;
    private readonly storyId: string;
    private readonly userId: string;
    private readonly currentInterruptions: DocumentInterruptions;
    private readonly indexToDelete: number;

    constructor(teamId: string, storyId: string, userId: string, currentInterruptions: DocumentInterruptions, indexToDelete: number)
    {
        super("Please be patient while we try to delete the interruption..");

        this.teamId = teamId;
        this.storyId = storyId;
        this.userId = userId;
        this.currentInterruptions = currentInterruptions;
        this.indexToDelete = indexToDelete;
    }

    onRollback = async (_: Updatable) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId).set(this.currentInterruptions);});
    }

    perform = async (updatable: Updatable) => 
    {
        const document = FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId);
        const newInterruptions = this.currentInterruptions.removeInterruptionImmutable(this.currentInterruptions.interruptions[this.indexToDelete]);

        try
        {
            await this.sendUpdates(updatable, ActionInterruptionsOfStoryLoaded.TYPE, async  () => 
            {   await document.update(newInterruptions);});

            this.onSuccess(updatable, "Successfully deleted the interruption.");
        }
        catch(error)
        {   this.onError(updatable, "Something went wrong while deleting the interruption, please try again.", error);}
    }
}