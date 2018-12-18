import AbstractChartGranularity from "./AbstractChartGranularity";

export default class ChartGranularity30m extends AbstractChartGranularity
{
    constructor ()
    {
        super("30m")
    }   
    
    getNextTimestamp(timestamp: Date): Date  {
        const next =  new Date(timestamp.getTime());
        if(timestamp.getMinutes() < 30)
        {
            next.setMinutes(30, 0, 0);
        }
        else
        {
            next.setHours(timestamp.getHours() + 1, 0, 0, 0);
        }
        return next;
    }

    getPreviousTimestamp(timestamp: Date): Date  {
        const previous =  new Date(timestamp.getTime());
        
        if(timestamp.getMinutes() < 30)
        {
            previous.setHours(timestamp.getHours() - 1, 30, 0, 0);
        }
        else
        {
            previous.setMinutes(0, 0, 0);
        }

        return previous;
    }

    setToGranularityStart(timestamp: Date): Date {
        const start = new Date(timestamp.getTime());
        if(start.getMinutes() < 30)
        {
            start.setMinutes(0, 0, 0);
        }
        else
        {
            start.setMinutes(30, 0, 0);
        }
        return start;
    }
    
    setToGranularityEnd(timestamp: Date): Date {
        const end = new Date(timestamp.getTime());
        if(end.getMinutes() < 30)
        {
            end.setMinutes(29, 59, 999);
        }
        else
        {
            end.setMinutes(59, 59, 999)
        }
        return end;
    }
}