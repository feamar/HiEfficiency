import ReduxStory from "../dtos/redux/ReduxStory";
import DocumentUser from "../dtos/firebase/firestore/documents/DocumentUser";
import EntitySchemaWeek from "../dtos/firebase/firestore/entities/EntitySchemaWeek";
import ProcessEfficiency from "./dtos/ProccessEfficiency";
import FirebaseAdapter from "../components/firebase/FirebaseAdapter";
import UtilityArray from "../utilities/UtilityArray";
import ReduxInterruptions from "../dtos/redux/ReduxInterruptions";

export default class EfficiencyEngine
{
    static getProcessEfficiency = async (story: ReduxStory): Promise<ProcessEfficiency>  =>
    {
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

    static calculateProcessEfficiency = (story: ReduxStory, users: Array<DocumentUser>): ProcessEfficiency   =>
    {
        const usersById = DocumentUser.asMap(users);
        var totalProductiveTime: number = 0;
        var totalInterruptionTime: number = 0;
      
        Object.keys(story.interruptions).forEach(key => 
        {
            const ofUser = EfficiencyEngine.calculateUserProcessEfficiency(story, story.interruptions[key], usersById.get(key));
            totalProductiveTime += ofUser.productiveTime!;
            totalInterruptionTime += ofUser.interruptionTime!;
        });

        return new ProcessEfficiency(totalProductiveTime, totalInterruptionTime, users.map(user => user.name));
    }

    //User could be undefined if the user entered an interruption on the story, and then removed his account from the database.
    static calculateUserProcessEfficiency = (story: ReduxStory, interruptions: ReduxInterruptions, user: DocumentUser | undefined): Partial<ProcessEfficiency>  =>
    {
        if(user == undefined) return new ProcessEfficiency(0, 0, []);

        const storyStarted = story.document.data.startedOn!;
        const storyFinished = story.document.data.finishedOn || new Date();

        var previousFrom: Date = storyStarted;
        var userProductiveTime: number = 0;
        var userInterruptionTime: number = 0;

        interruptions.document.data.interruptions.forEach(interruption => 
        {
            userProductiveTime += EfficiencyEngine.dateDiff(user.weekSchema, previousFrom, interruption.timestamp);
            userInterruptionTime += interruption.duration || 0;
            
            previousFrom = interruption.duration ? new Date(interruption.timestamp.getTime() + interruption.duration) : storyFinished;
        });

        userProductiveTime += EfficiencyEngine.dateDiff(user.weekSchema, previousFrom, storyFinished);
        return new ProcessEfficiency(userProductiveTime, userInterruptionTime, [user.name]);
    }

    calculateInterruptionTime = () =>
    {

    }

    static dateDiff = (_schema: EntitySchemaWeek, earlierDate: Date, laterDate: Date) =>
    {
        return laterDate.getTime() - earlierDate.getTime();
    }
}