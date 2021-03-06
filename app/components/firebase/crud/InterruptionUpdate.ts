import FirebaseAdapter from "../FirebaseAdapter";
import update, { Spec } from "immutability-helper";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import DocumentInterruptions from '../../../dtos/firebase/firestore/documents/DocumentInterruptions';
import EntityInterruption from '../../../dtos/firebase/firestore/entities/EntityInterruption';
import ActionInterruptionsOfStoryLoaded from "../../../redux/actions/user/ActionInterruptionsOfStoryLoaded";
import equal from "deep-equal";

export default class InterruptionUpdate extends AbstractCrudOperation
{
    private readonly teamId: string;
    private readonly storyId: string;
    private readonly userId: string;
    private readonly oldInterruptions: DocumentInterruptions;
    private readonly oldInterruption: EntityInterruption;
    private readonly updates: Spec<EntityInterruption, never>;


    constructor(teamId: string, storyId: string, userId: string, oldInterruptions: DocumentInterruptions, oldInterruption: EntityInterruption, updates: Spec<EntityInterruption, never>)
    {
        super("Please be patient while we try to update the interruption..");

        this.teamId = teamId;
        this.storyId = storyId;
        this.userId = userId;
        this.oldInterruptions = oldInterruptions;
        this.oldInterruption = oldInterruption;
        this.updates = updates;
    }

    onRollback = async (_: Updatable) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId).set(this.oldInterruptions);});
    }

    perform = async (updatable: Updatable) => 
    {
        const index = this.oldInterruptions.interruptions.indexOf(this.oldInterruption);
        if(index < 0)
        {   
            this.onError(updatable, "The interruption you want to update could not be found, please try again.", undefined);
            return;
        }

        const newInterruption: EntityInterruption = update(this.oldInterruption, this.updates);
        const newInterruptions: DocumentInterruptions = this.oldInterruptions.replaceInterruptionImmutable(this.oldInterruption, newInterruption);
        
        if(equal(newInterruptions, this.oldInterruptions))
        {
            this.onSuccess(updatable, "No necessary updates were detected.");
            return;
        }

        try
        {
            await this.sendUpdates(updatable, ActionInterruptionsOfStoryLoaded.TYPE, async () => 
            {   await FirebaseAdapter.getInterruptionsFromTeam(this.teamId, this.storyId).doc(this.userId).update(newInterruptions);});

            this.onSuccess(updatable, "Successfully updated the interruption.");
        }
        catch(error)
        {   this.onError(updatable, "Something went wrong while updating the interruption, please try again.", error);}
    }
}