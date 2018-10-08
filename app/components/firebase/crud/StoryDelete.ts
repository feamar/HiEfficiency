import FirebaseAdapter from "../FirebaseAdapter";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import { RNFirebase } from 'react-native-firebase';
import ActionStoryDeleted from '../../../redux/actions/user/ActionStoryDeleted';

export default class StoryDelete extends AbstractCrudOperation
{
    private readonly teamId: string;
    private readonly storyId: string;
    private oldStory?: RNFirebase.firestore.DocumentSnapshot;

    constructor(teamId: string, storyId: string)
    {
        super("Please be patient while we try to delete the story..");

        this.teamId = teamId;
        this.storyId = storyId;
    }

    onRollback = async (_: Updatable) =>
    {
        if(this.oldStory != undefined)
        {
            const data = this.oldStory.data();
            if(data != undefined)
            {
                this.attemptRollback(0, 10, async () => 
                {   await FirebaseAdapter.getStories(this.teamId).doc(this.storyId).set(data);});
            }
        }
    }

    perform = async (updatable: Updatable) => 
    {
        try
        {
            const doc = FirebaseAdapter.getStories(this.teamId).doc(this.storyId);
            this.oldStory = await doc.get();

            await this.sendUpdates(updatable, ActionStoryDeleted.TYPE, async () => 
            {   await doc.delete();});

            this.onSuccess(updatable, "Successfully deleted the user story.");
        }
        catch(error)
        {   this.onError(updatable, "Something went wrong while deleting the story, please try again.", error);}
    }
}