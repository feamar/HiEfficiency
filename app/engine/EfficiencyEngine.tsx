import ReduxStory from "../dtos/redux/ReduxStory";
import DocumentUser from "../dtos/firebase/firestore/documents/DocumentUser";
import EntitySchemaWeek from "../dtos/firebase/firestore/entities/EntitySchemaWeek";
import ProcessEfficiency from "./dtos/ProccessEfficiency";
import ReduxInterruptions from "../dtos/redux/ReduxInterruptions";
import ProcessEfficiencyError from "./dtos/ProcessEfficiencyError";
import { ProcessEfficiencyErrorType } from "./dtos/ProcessEfficiencyErrorType";
import ProcessEfficiencyErrors from "./dtos/ProcessEfficiencyErrors";
import UtilityDate from "../utilities/UtilityDate";
import EntitySchemaDay from "../dtos/firebase/firestore/entities/EntitySchemaDay";

export default class EfficiencyEngine
{
    static getProcessEfficiency = async (story: ReduxStory): Promise<ProcessEfficiency | ProcessEfficiencyErrors>  =>
    {
        if(story.document.data.startedOn == undefined)
        {   return new ProcessEfficiencyErrors([new ProcessEfficiencyError(ProcessEfficiencyErrorType.StoryUnstarted)]);}

        if(story.document.data.startedOn > new Date())
        {   return new ProcessEfficiencyErrors([new ProcessEfficiencyError(ProcessEfficiencyErrorType.StoryStartInFuture)])}

        const users = await DocumentUser.getAllAsArray(story);
        return EfficiencyEngine.calculateProcessEfficiency(story, users);
    }

    static calculateProcessEfficiency = (story: ReduxStory, users: Array<DocumentUser>): ProcessEfficiency | ProcessEfficiencyErrors =>
    {
        const usersById = DocumentUser.asMap(users);
        var totalProductiveTime: number = 0;
        var totalInterruptionTime: number = 0;

        const keys = Object.keys(story.interruptions);
        if(keys.length == 0)
        {   return new ProcessEfficiency(new Date().getTime() - story.document.data.startedOn!.getTime(), 0, []);}

        var foundInterruptions = false;
        var errors: ProcessEfficiencyErrors = new ProcessEfficiencyErrors();
        keys.forEach(key => 
        {
            const value = story.interruptions[key];
            if(value.document.data.interruptions.length > 0)
            {   foundInterruptions = true;}

            const processEfficiencyOrError = EfficiencyEngine.calculateUserProcessEfficiency(story, story.interruptions[key], usersById.get(key));

            if(processEfficiencyOrError instanceof ProcessEfficiency)
            {
                totalProductiveTime += processEfficiencyOrError.productiveTime!;
                totalInterruptionTime += processEfficiencyOrError.interruptionTime!;
            }
            else
            {   errors = errors.merge(processEfficiencyOrError);}
        });

        if(foundInterruptions == false)
        {   return new ProcessEfficiency(new Date().getTime() - story.document.data.startedOn!.getTime(), 0, []);}

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

    static dateDiff = (schema: EntitySchemaWeek, earlierDate: Date, laterDate: Date, username: string): number | ProcessEfficiencyError =>
    {
        const earlier = earlierDate.getTime();
        const later = laterDate.getTime();
        
        if(earlier > later)
        {   return new ProcessEfficiencyError(ProcessEfficiencyErrorType.IncorrectOrder, [username]);}

        var result = 0;
        if(UtilityDate.areOnSameDay(earlierDate, laterDate))
        {   return laterDate.getTime() - earlierDate.getTime();}

        const first = schema.getDayOfDate(earlierDate);
        const millisecondsOfDayStart = earlierDate.getTime() % 86400000;
        if(millisecondsOfDayStart < first.getEndAsMilliseconds())
        {   result += first.getEndAsMilliseconds() - millisecondsOfDayStart;}

        const last = schema.getDayOfDate(laterDate);
        const millisecondsOfDayEnd = laterDate.getTime() % 86400000;
        if(millisecondsOfDayEnd > last.getStartAsMilliseconds())
        {   result += millisecondsOfDayEnd - last.getStartAsMilliseconds()}

        EfficiencyEngine.forEachDayBetweenDates(schema, earlierDate, laterDate, (day, index, amountOfDays) => 
        {   
            if(index != 0 && index != amountOfDays - 1)
            {   result += day.getHours() * 60 * 60 * 1000;}
        });
    
        return result;
    }


    static forEachDayBetweenDates = (schema: EntitySchemaWeek, started: Date, finished: Date, closure: (day: EntitySchemaDay, index: number, amountOfDays: number) => void) =>
    {
        var index = (started.getDay() + 1 ) % 7;
        const amountOfDays = EfficiencyEngine.getDaysBetweenDates(started, finished);
        for(var i = 0 ; i < amountOfDays ; i ++)
        {
            const day = schema.getByIndex(index);
            closure(day!, i, amountOfDays);
            index = (index + 1) % 7;
        }
    }

    static getDaysBetweenDates = (started: Date, finished: Date) =>
    {
        const difference = Math.abs(finished.getTime() - started.getTime());
        const amount = Math.floor(difference / 86400000);

        return amount;
    }
}