import AbstractChartGranularity from "./AbstractChartGranularity";

export default class ChartGranularity15m extends AbstractChartGranularity
{
    constructor ()
    {
        super("15m")
    }   
    
    getNextTimestamp(timestamp: Date): Date  {
        const next =  new Date(timestamp.getTime());
        if(timestamp.getMinutes() < 45)
        {
            next.setMinutes(timestamp.getMinutes() + 15, 0, 0);
        }
        else
        {
            next.setHours(timestamp.getHours() + 1, 0, 0, 0);
        }
        return next;
    }

    getPreviousTimestamp(timestamp: Date): Date  {
        const previous =  new Date(timestamp.getTime());
        
        if(timestamp.getMinutes() < 15)
        {
            previous.setHours(timestamp.getHours() - 1, 45, 0, 0);
        }
        else
        {
            previous.setMinutes(timestamp.getMinutes() - 15, 0, 0);
        }

        return previous;
    }

    setToGranularityStart(timestamp: Date): Date {
        const start = new Date(timestamp.getTime());
        start.setMinutes(start.getMinutes() - (start.getMinutes() % 15));
        return start;
    }
    
    setToGranularityEnd(timestamp: Date): Date {
        const end = new Date(timestamp.getTime());
        const index = Math.floor(timestamp.getMinutes() / 15) + 1;
        end.setMinutes(index * 15 - 1, 59, 999);
        return end;
    }
}