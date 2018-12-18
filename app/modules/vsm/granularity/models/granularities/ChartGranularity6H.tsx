import AbstractChartGranularity from "./AbstractChartGranularity";

export default class ChartGranularity6H extends AbstractChartGranularity
{
    constructor ()
    {
        super("6H")
    }   
    
    getNextTimestamp(timestamp: Date): Date  {
        const next =  new Date(timestamp.getTime());
        next.setHours(timestamp.getHours() + 6);
        return next;
    }

    getPreviousTimestamp(timestamp: Date): Date  {
        const previous =  new Date(timestamp.getTime());
        previous.setHours(timestamp.getHours() - 6);
        return previous;
    }

    setToGranularityStart(timestamp: Date): Date {
        const start = new Date(timestamp.getTime());
        start.setHours(timestamp.getHours() - Math.floor(timestamp.getHours() % 6));
        return start;
    }
    
    setToGranularityEnd(timestamp: Date): Date {
        const end = new Date(timestamp.getTime());        
        const interval = Math.floor(timestamp.getHours() / 6) * 6 - 1;
        end.setHours(interval, 59, 59, 999);
        return end;
    }
}