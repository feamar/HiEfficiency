import AbstractChartGranularity from "./AbstractChartGranularity";

export default class ChartGranularity1W extends AbstractChartGranularity
{
    constructor ()
    {
        super("1W")
    }   
    
    getNextTimestamp(timestamp: Date): Date {
        const tomorrow =  new Date(timestamp.getTime());
        tomorrow.setDate(timestamp.getDate() + 7);
        return tomorrow;
    }

    getPreviousTimestamp(timestamp: Date): Date{
        const previous =  new Date(timestamp.getTime());
        previous.setDate(timestamp.getDate() - 7);
        return previous;
    }
    
    setToGranularityStart(timestamp: Date): Date {
        const start = new Date(timestamp.getTime());
        start.setDate(timestamp.getDate() - timestamp.getDay() + 1);
        return start;
    }

    setToGranularityEnd(timestamp: Date): Date {
        const end = new Date(timestamp.getTime());
        end.setDate(timestamp.getDate() + (7 - timestamp.getDay()));
        return end;
    }

}