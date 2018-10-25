import FirebaseAdapter from "../FirebaseAdapter";
import update, { Spec } from "immutability-helper";
import equal from "deep-equal";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import DocumentStory from '../../../dtos/firebase/firestore/documents/DocumentStory';
import ActionStoriesOfTeamLoaded from "../../../redux/actions/user/ActionStoriesOfTeamLoaded";

export default class StoryUpdate extends AbstractCrudOperation
{
    private readonly teamId: string;
    private readonly storyId: string;
    private readonly oldStory: DocumentStory;
    private readonly updates: Spec<DocumentStory, never>;

    constructor(teamId: string, storyId: string, oldStory: DocumentStory, updates: Spec<DocumentStory, never>)
    {
        super("Please be patient while we try to update the story..");

        this.teamId = teamId;
        this.storyId = storyId;
        this.oldStory = oldStory;
        this.updates = updates;
    }

    onRollback = async (_: Updatable) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getStories(this.teamId).doc(this.storyId).set(this.oldStory);});
    }

    perform = async (updatable: Updatable) => 
    {
        try 
        {
            const newStory = update(this.oldStory, this.updates);
            if(equal(newStory, this.oldStory))
            {
                this.onSuccess(updatable, "No necessary updates were detected.");
                return;
            }


            await this.sendUpdates(updatable, ActionStoriesOfTeamLoaded.TYPE, async () => 
            {   await FirebaseAdapter.getStories(this.teamId).doc(this.storyId).update(newStory);});
            this.onSuccess(updatable, "Successfully updated the story.");
        }
        catch(error)
        {   this.onError(updatable, "Story could not be updated, please try again.", error);}
    }
}