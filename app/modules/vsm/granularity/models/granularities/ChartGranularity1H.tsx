import AbstractChartGranularity from "./AbstractChartGranularity";

export default class ChartGranularity1H extends AbstractChartGranularity
{
    constructor ()
    {
        super("1H")
    }   
    
    getNextTimestamp(timestamp: Date): Date  {
        const next =  new Date(timestamp.getTime());
        next.setHours(timestamp.getHours() + 1);
        return next;
    }

    getPreviousTimestamp(timestamp: Date): Date  {
        const previous =  new Date(timestamp.getTime());
        previous.setHours(timestamp.getHours() - 1);
        return previous;
    }

    setToGranularityStart(timestamp: Date): Date {
        const start = new Date(timestamp.getTime());
        start.setMinutes(0, 0, 0);
        return start;
    }
    
    setToGranularityEnd(timestamp: Date): Date {
        const end = new Date(timestamp.getTime());
        end.setMinutes(59, 59, 999);
        return end;
    }
}