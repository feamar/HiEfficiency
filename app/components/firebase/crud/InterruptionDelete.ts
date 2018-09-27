import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import AbstractCrudOperation from './AbstractCrudOperation';
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

    onRollback = async (_: DialogLoading) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId).set(this.currentInterruptions);});
    }

    perform = async (dialog: DialogLoading) => 
    {
        //console.log("DELETING INTERRUPTION: " + this.teamId + " and " + this.storyId + " and " + this.userId  + " at index: " + this.indexToDelete + " with interruptions: " + UtilityObject.stringify(this.currentInterruptions));
        const document = FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId);
        const newInterruptions = this.currentInterruptions.removeInterruptionImmutable(this.currentInterruptions.interruptions[this.indexToDelete]);

        try
        {
            await this.sendUpdates(dialog, ActionInterruptionsOfStoryLoaded.TYPE, async  () => 
            {   await document.update(newInterruptions);});

            this.onSuccess(dialog, "Successfully deleted the interruption.");
        }
        catch(error)
        {   this.onError(dialog, "Something went wrong while deleting the interruption, please try again.", error);}
    }
}