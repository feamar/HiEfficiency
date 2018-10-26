import ReduxStory from "../dtos/redux/ReduxStory";
import DocumentUser from "../dtos/firebase/firestore/documents/DocumentUser";
import EntitySchemaWeek from "../dtos/firebase/firestore/entities/EntitySchemaWeek";
import ProcessEfficiency from "./dtos/ProccessEfficiency";
import FirebaseAdapter from "../components/firebase/FirebaseAdapter";
import UtilityArray from "../utilities/UtilityArray";
import ReduxInterruptions from "../dtos/redux/ReduxInterruptions";
import ProcessEfficiencyError from "./dtos/ProcessEfficiencyError";
import { ProcessEfficiencyErrorType } from "./dtos/ProcessEfficiencyErrorType";
import ProcessEfficiencyErrors from "./dtos/ProcessEfficiencyErrors";

export default class EfficiencyEngine
{
    static getProcessEfficiency = async (story: ReduxStory): Promise<ProcessEfficiency | ProcessEfficiencyErrors>  =>
    {
        if(story.document.data.startedOn == undefined)
        {       return new ProcessEfficiencyErrors([new ProcessEfficiencyError(ProcessEfficiencyErrorType.StoryUnstarted)]);}

        const users = await EfficiencyEngine.getUsers(story);
        return EfficiencyEngine.calculateProcessEfficiency(story, users);
    }

    //TODO: Switch to dependency injection for database interface.
    static getUsers = async (story: ReduxStory): Promise<Array<DocumentUser>>  =>
    {
        const keys = Object.keys(story.interruptions);
        const promises = keys.map(async key => 
        {
            const document = await FirebaseAdapter.getUsers().doc(key).get();
            return DocumentUser.fromSnapshot(document);
        });
        const users = await Promise.all(promises);

        return UtilityArray.asDefinedType(users);
    }

    static calculateProcessEfficiency = (story: ReduxStory, users: Array<DocumentUser>): ProcessEfficiency | ProcessEfficiencyErrors =>
    {
        const usersById = DocumentUser.asMap(users);
        var totalProductiveTime: number = 0;
        var totalInterruptionTime: number = 0;

        var errors: ProcessEfficiencyErrors = new ProcessEfficiencyErrors();
        Object.keys(story.interruptions).forEach(key => 
        {
            const processEfficiencyOrError = EfficiencyEngine.calculateUserProcessEfficiency(story, story.interruptions[key], usersById.get(key));

            if(processEfficiencyOrError instanceof ProcessEfficiency)
            {
                totalProductiveTime += processEfficiencyOrError.productiveTime!;
                totalInterruptionTime += processEfficiencyOrError.interruptionTime!;
            }
            else
            {   errors = errors.merge(processEfficiencyOrError);}
        });

        if(errors.hasAny())
        {   return errors;}
        else
        {   return new ProcessEfficiency(totalProductiveTime, totalInterruptionTime, users.map(user => user.name));}
    }

    //User could be undefined if the user entered an interruption on the story, and then removed his account from the database.
    static calculateUserProcessEfficiency = (story: ReduxStory, interruptions: ReduxInterruptions, user: DocumentUser | undefined): ProcessEfficiency | ProcessEfficiencyErrors  =>
    {
        if(user == undefined) return new ProcessEfficiency(0, 0, []);

        const storyStarted = story.document.data.startedOn!;
        const storyFinished = story.document.data.finishedOn || new Date();

        var previousFrom: Date = storyStarted;
        var userProductiveTime: number = 0;
        var userInterruptionTime: number = 0;

        var errors: ProcessEfficiencyErrors = new ProcessEfficiencyErrors();

        interruptions.document.data.interruptions.forEach(interruption => 
        {
            const differenceOrError = EfficiencyEngine.dateDiff(user.weekSchema, previousFrom, interruption.timestamp, user.name);
            if(differenceOrError instanceof ProcessEfficiencyError)
            {
                errors.addNoDuplicate(differenceOrError);
            }
            else
            {
                userProductiveTime += differenceOrError;
                userInterruptionTime += interruption.duration || 0;
            }
            
            previousFrom = interruption.duration ? new Date(interruption.timestamp.getTime() + interruption.duration) : storyFinished;
        });

        const differenceOrError = EfficiencyEngine.dateDiff(user.weekSchema, previousFrom, storyFinished, user.name);
        if(differenceOrError instanceof ProcessEfficiencyError)
        {
            errors.addNoDuplicate(differenceOrError);
        }
        else
        {   userProductiveTime += differenceOrError;}

        if(errors.hasAny())
        {   return errors;}
        else
        {   return new ProcessEfficiency(userProductiveTime, userInterruptionTime, [user.name]);}
    }

    static dateDiff = (_schema: EntitySchemaWeek, earlierDate: Date, laterDate: Date, username: string): number | ProcessEfficiencyError =>
    {
        const earlier = earlierDate.getTime();
        const later = laterDate.getTime();
        
        if(earlier > later)
        {   return new ProcessEfficiencyError(ProcessEfficiencyErrorType.IncorrectOrder, [username]);}

        return laterDate.getTime() - earlierDate.getTime();
    }
}