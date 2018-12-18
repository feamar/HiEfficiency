import ReduxStory from "../dtos/redux/ReduxStory";
import DocumentUser from "../dtos/firebase/firestore/documents/DocumentUser";
import EntitySchemaWeek from "../dtos/firebase/firestore/entities/EntitySchemaWeek";
import ProcessEfficiency from "./dtos/ProcessEfficiency";
import ReduxInterruptions from "../dtos/redux/ReduxInterruptions";
import ProcessEfficiencyError from "./dtos/ProcessEfficiencyError";
import { ProcessEfficiencyErrorType } from "./dtos/ProcessEfficiencyErrorType";
import ProcessEfficiencyErrors from "./dtos/ProcessEfficiencyErrors";
import UtilityDate from "../utilities/UtilityDate";
import EntitySchemaDay from "../dtos/firebase/firestore/entities/EntitySchemaDay";
import ProcessEfficiencyBuilder from "./dtos/ProcessEfficiencyBuilder";

export default class EfficiencyEngine
{
    static getProcessEfficiency = async (story: ReduxStory, from: Date, to: Date): Promise<ProcessEfficiency | ProcessEfficiencyErrors>  =>
    {
        if(story.document.data.startedOn == undefined)
        {   return new ProcessEfficiencyErrors([new ProcessEfficiencyError(ProcessEfficiencyErrorType.StoryUnstarted)]);}

        if(story.document.data.startedOn > new Date())
        {   return new ProcessEfficiencyErrors([new ProcessEfficiencyError(ProcessEfficiencyErrorType.StoryStartInFuture)])}

        const users = await DocumentUser.getAllAsArray(story);
        return EfficiencyEngine.calculateProcessEfficiency(story, users, from, to);
    }

    private static calculateProcessEfficiency = (story: ReduxStory, users: Array<DocumentUser>, from: Date, to: Date): ProcessEfficiency | ProcessEfficiencyErrors =>
    {
        const usersById = DocumentUser.asMap(users);
        const userIds = Object.keys(story.interruptions);

        if(userIds.length == 0 || userIds.some(e => story.interruptions[e].document.data.interruptions.length > 0) == false)
        {  
            const duration = to.getTime() - from.getTime();
            return new ProcessEfficiency(duration, duration, 0, []);
        }

        const builder: ProcessEfficiencyBuilder = new ProcessEfficiencyBuilder(from, to);
        
        userIds.forEach(key => 
        {
            const processEfficiencyOrError = EfficiencyEngine.calculateUserProcessEfficiency(story.interruptions[key], usersById.get(key), from, to);
            builder.addEfficiency(processEfficiencyOrError);
        });


        return builder.build()
    }

    private static calculateUserProcessEfficiency= (participant: ReduxInterruptions, user: DocumentUser | undefined, from: Date, to: Date): ProcessEfficiency | ProcessEfficiencyErrors =>
    {
        if(user == undefined) 
        {
            return new ProcessEfficiency(0, 0, 0, []);
        }
    
        const builder: ProcessEfficiencyBuilder = new ProcessEfficiencyBuilder(from, to);
        const potentialTime = EfficiencyEngine.calculateUserPotentialTime(user.weekSchema, from, to, user.name);
        const interruptedTime = EfficiencyEngine.calculateUserInterruptedTime(from, to, participant)
        
        builder.addInterruptedTime(interruptedTime);
        if(potentialTime instanceof ProcessEfficiencyError)
        {
            builder.addError(potentialTime);
        }
        else
        {
            builder.addProductiveTime(potentialTime - interruptedTime);
        }

        return builder.build();
    }

    private static calculateUserInterruptedTime = (from: Date , to: Date, participant: ReduxInterruptions) =>
    {
        var cummulative = 0;
        for(var i = 0 ; i < participant.document.data.interruptions.length ; i ++)
        {
            const interruption = participant.document.data.interruptions[i];
            const start = interruption.timestamp;
            const end = new Date(interruption.timestamp.getTime() + (interruption.duration || (new Date().getTime() - interruption.timestamp.getTime())));

            if(start >= from && end <= to)
            {
                cummulative += interruption.duration || end.getTime() - start.getTime();
            }   
            else if(start < from && end >= from && end <= to)
            {
                cummulative += end.getTime() - from.getTime();
            }
            else if(start > from && start < to && end > to)
            {
                cummulative += to.getTime() - start.getTime();
            }
            else if(start < from && end > to)
            {
                cummulative += to.getTime() - from.getTime();
            }
        }

        return cummulative;
    }


    /*
    //User could be undefined if the user entered an interruption on the story, and then removed his account from the database.
    static calculateUserProcessEfficiency = (story: ReduxStory, participant: ReduxInterruptions, user: DocumentUser | undefined, from: Date, to: Date): ProcessEfficiency | ProcessEfficiencyErrors  =>
    {
        if(user == undefined) 
        {
            return new ProcessEfficiency(0, 0, []);
        }
        
        return EfficiencyEngine.calculateUserProcessEfficiencyInternal(story.document.data.startedOn!, story.document.data.getCurrentFinishedOn(), participant, user, from, to);    
    }

    private static calculateUserProcessEfficiencyInternal = (previousFrom: Date, storyFinished: Date, participant: ReduxInterruptions, user: DocumentUser, from: Date, to: Date) =>
    {
        var builder: ProcessEfficiencyBuilder = new ProcessEfficiencyBuilder();
        participant.document.data.interruptions.forEach(interruption => 
        {
            const interval = EfficiencyEngine.calculatePotentialTime(user.weekSchema, previousFrom, interruption.timestamp, user.name);
            builder.addInterval(interval, interruption);
            previousFrom = interruption.duration ? new Date(interruption.timestamp.getTime() + interruption.duration) : storyFinished;
        });

        return builder.addInterval(EfficiencyEngine.calculatePotentialTime(user.weekSchema, previousFrom, storyFinished, user.name)).build();
    } */

    private static calculateUserPotentialTime = (schema: EntitySchemaWeek, from: Date, to: Date, username: string): number | ProcessEfficiencyError =>
    {
        const earlier = from.getTime();
        const later = to.getTime();
        
        if(earlier > later)
        {   
            return new ProcessEfficiencyError(ProcessEfficiencyErrorType.IncorrectOrder, [username]);
        }

        var result = 0;
        if(UtilityDate.areOnSameDay(from, to))
        { 
            return later - earlier; 
        }

        // schema.getTimeWorkedOnFirstDayOfStory
        const scheduledWorkEnd = schema.getDayOfDate(from).getEndAsMilliseconds();
        const dayStart = earlier % 86400000;
        result += EfficiencyEngine.howMuchBigger(scheduledWorkEnd, dayStart);

        // schema.getTimeWorkedOnLastDayOfStory
        const scheduledWorkStart = schema.getDayOfDate(to).getStartAsMilliseconds();
        const dayEnd = later % 86400000;
        result += EfficiencyEngine.howMuchBigger(dayEnd, scheduledWorkStart);

        EfficiencyEngine.forEachDayBetweenDates(schema, from, to, (day, index, amountOfDays) => 
        {   
            if(index != 0 && index != amountOfDays - 1)
            // schema.getTotalTimeOnDay
            {   
                result += day.getHours() * 60 * 60 * 1000;
            }
        });
    
        return result;
    }

    private static howMuchBigger = (isThis: number, thanThis: number) =>
    {
        // In our particular case, we want to return 0 if isThis is smaller than thanThis
        return Math.abs(Math.max(isThis - thanThis, 0))
    }    


    private static forEachDayBetweenDates = (schema: EntitySchemaWeek, from: Date, to: Date, closure: (day: EntitySchemaDay, index: number, amountOfDays: number) => void) =>
    {
        var index = (from.getDay() + 1 ) % 7;
        const amountOfDays = EfficiencyEngine.getDaysBetweenDates(from, to);
        for(var i = 0 ; i < amountOfDays ; i ++)
        {
            const day = schema.getByIndex(index);
            closure(day!, i, amountOfDays);
            index = (index + 1) % 7;
        }
    }

    
    private static getDaysBetweenDates = (started: Date, finished: Date) =>
    {
        const difference = Math.abs(finished.getTime() - started.getTime());
        const amount = Math.floor(difference / 86400000);

        return amount;
    }
}