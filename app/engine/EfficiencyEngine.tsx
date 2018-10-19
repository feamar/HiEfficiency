import ReduxStory from "../dtos/redux/ReduxStory";
import DocumentUser from "../dtos/firebase/firestore/documents/DocumentUser";
import EntitySchemaWeek from "../dtos/firebase/firestore/entities/EntitySchemaWeek";
import EntitySchemaDay from "../dtos/firebase/firestore/entities/EntitySchemaDay";

export default class EfficiencyEngine
{
    static getProcessEfficiency = (story: ReduxStory, usersOfTeam: Array<DocumentUser>) =>
    {
        const started = story.document.data.startedOn;
        const finished = story.document.data.finishedOn || new Date();

        if(started == undefined)
        {   return 0;}

        var totalPossible = 0;
        var totalInterrupted = 0;

        usersOfTeam.forEach(user =>
        {
            const schema = user.weekSchema || EntitySchemaWeek.default();
            const ofUser = story.interruptions[user.uid];

            if(ofUser == undefined)
            {   return;}

            const possible = EfficiencyEngine.getTotalPossibleWorkedTime(schema, started, finished);
            const interrupted = ofUser.document.data.getTotalInterruptionTime();

            totalPossible += possible;
            totalInterrupted += interrupted;

            console.log("For user: " + user.uid + ": " + (possible - interrupted) + " of " + possible + " causes " + (totalPossible - totalInterrupted) + " of " + totalPossible);
        });

        if(totalInterrupted == 0)
        {   return 1;}

        const efficiency = 1 - (totalInterrupted / totalPossible);
        console.log("Process Efficiency: " + efficiency);

        return efficiency;
    }

    static getTotalPossibleWorkedTime = (schema: EntitySchemaWeek, started: Date, finished: Date) =>
    {   
        var cummulative = 0;
        EfficiencyEngine.forEachDayBetweenDates(schema, started, finished, (day: EntitySchemaDay, index: number, days: number) => 
        {
            //First day, middle days or last day. 
            if(index == 0)
            {   cummulative += day.getMillisecondsOnDay(started, "Start");}
            else if (index < days - 1)
            {   cummulative += day.getHours() * 60 * 60 * 1000;}
            else
            {   cummulative += day.getMillisecondsOnDay(finished, "End");}
        });

        return cummulative;
    }

    static forEachDayBetweenDates = (schema: EntitySchemaWeek, started: Date, finished: Date, closure: (day: EntitySchemaDay, index: number, total: number) => void) =>
    {
        var index = (started.getDay() + 1 ) % 7;
        const days = EfficiencyEngine.getDaysBetweenDates(started, finished);
        for(var i = 0 ; i < days ; i ++)
        {
            const day = schema.getByIndex(index);
            console.log("forEachDayBetweenDates: " + days + " - " + i);
            closure(day!, i, days);
            index = (index + 1) % 7;
        }
    }

    static getDaysBetweenDates = (started: Date, finished: Date) =>
    {
        const difference = Math.abs(finished.getTime() - started.getTime());
        const amount = Math.floor(difference / 86400000);

        console.log("getDaysBetweenDates: " + amount);
        return amount;
    }






}