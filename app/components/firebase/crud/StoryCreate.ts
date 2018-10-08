import FirebaseAdapter from "../FirebaseAdapter";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import DocumentStory from '../../../dtos/firebase/firestore/documents/DocumentStory';
import ActionStoryCreated from "../../../redux/actions/user/ActionStoryCreated";
import { RNFirebase } from "react-native-firebase";

export default class StoryCreate extends AbstractCrudOperation
{
    private readonly teamId: string;
    private readonly story: DocumentStory;
    private doc?: RNFirebase.firestore.DocumentReference;

    constructor(teamId: string, story: DocumentStory)
    {
        super("Please be patient while we try to create the story..");

        this.teamId = teamId;
        this.story = story;
    }

    onRollback = async (_: Updatable) =>
    {
        //console.log("STORYC REATE ROLLBACK: " + this.doc);
        if(this.doc != undefined)
        {
            this.attemptRollback(0, 10, async () => 
            {   
                if(this.doc != undefined)
                {   await this.doc.delete();}
            });
        }
    }

    perform = async (updatable: Updatable) => 
    {
        //console.log("CREATING STORY: " + UtilityObject.stringify(this.story));
        try
        {
            this.doc = await this.sendUpdates(updatable, ActionStoryCreated.TYPE, async (): Promise<RNFirebase.firestore.DocumentReference> => 
            {   return await FirebaseAdapter.getStories(this.teamId).add(this.story);});
    
            this.onSuccess(updatable, "Story successfully created!");
        }
        catch(error)
        {   this.onError(updatable, "Something went wrong while creating the story, please try again later.", error);}
    }
}