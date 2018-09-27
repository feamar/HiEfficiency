import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update, { Spec } from "immutability-helper";
import AbstractCrudOperation from './AbstractCrudOperation';
import DocumentInterruptions from '../../../dtos/firebase/firestore/documents/DocumentInterruptions';
import EntityInterruption from '../../../dtos/firebase/firestore/entities/EntityInterruption';
import ActionInterruptionsOfStoryLoaded from "../../../redux/actions/user/ActionInterruptionsOfStoryLoaded";

export default class InterruptionUpdate extends AbstractCrudOperation
{
    private readonly teamId: string;
    private readonly storyId: string;
    private readonly userId: string;
    private readonly currentInterruptions: DocumentInterruptions;
    private readonly oldInterruption: EntityInterruption;
    private readonly updates: Spec<EntityInterruption, never>;


    constructor(teamId: string, storyId: string, userId: string, currentInterruptions: DocumentInterruptions, oldInterruption: EntityInterruption, updates: Spec<EntityInterruption, never>)
    {
        super("Please be patient while we try to update the interruption..");

        this.teamId = teamId;
        this.storyId = storyId;
        this.userId = userId;
        this.currentInterruptions = currentInterruptions;
        this.oldInterruption = oldInterruption;
        this.updates = updates;
    }

    onRollback = async (_: DialogLoading) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId).set(this.currentInterruptions);});
    }

    perform = async (dialog: DialogLoading) => 
    {
        //console.log("UPDATING INTERRUPTION FOR " + this.teamId + " and " + this.storyId + " and " + this.userId + " with old: " + UtilityObject.stringify(this.oldInterruption)  + " and updates: " + UtilityObject.stringify(this.updates) + " and current interruptions is a collection of : " + UtilityObject.stringify(this.currentInterruptions));
        
        const index = this.currentInterruptions.interruptions.indexOf(this.oldInterruption);
        if(index < 0)
        {   
            this.onError(dialog, "The interruption you want to update could not be found, please try again.", undefined);
            return;
        }

        const newInterruption: EntityInterruption = update(this.oldInterruption, this.updates);
        const newInterruptions: DocumentInterruptions = this.currentInterruptions.replaceInterruptionImmutable(this.oldInterruption, newInterruption);
        
        try
        {
            await this.sendUpdates(dialog, ActionInterruptionsOfStoryLoaded.TYPE, async () => 
            {   await FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId).update(newInterruptions);});

            this.onSuccess(dialog, "Successfully updated the interruption.");
        }
        catch(error)
        {   this.onError(dialog, "Something went wrong while updating the interruption, please try again.", error);}
    }
}