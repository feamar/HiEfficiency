import FirebaseAdapter from "../FirebaseAdapter";
import AbstractCrudOperation from './AbstractCrudOperation';
import DocumentStory from '../../../dtos/firebase/firestore/documents/DocumentStory';
import ActionStoryCreated from "../../../redux/actions/user/ActionStoryCreated";
import DialogLoading from "../../dialogs/instances/DialogLoading";
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

    onRollback = async (_: DialogLoading) =>
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

    perform = async (dialog: DialogLoading) => 
    {
        //console.log("CREATING STORY: " + UtilityObject.stringify(this.story));
        try
        {
            this.doc = await this.sendUpdates(dialog, ActionStoryCreated.TYPE, async (): Promise<RNFirebase.firestore.DocumentReference> => 
            {   return await FirebaseAdapter.getStories(this.teamId).add(this.story);});
    
            this.onSuccess(dialog, "Story successfully created!");
        }
        catch(error)
        {   this.onError(dialog, "Something went wrong while creating the story, please try again later.", error);}
    }
}