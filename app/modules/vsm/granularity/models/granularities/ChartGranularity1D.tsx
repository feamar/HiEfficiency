import AbstractChartGranularity from "./AbstractChartGranularity";

export default class ChartGranularity1D extends AbstractChartGranularity
{
    constructor ()
    {
        super("1D")
    }   
    
    getNextTimestamp(timestamp: Date): Date  {
        const tomorrow =  new Date(timestamp.getTime());
        tomorrow.setDate(timestamp.getDate() + 1);
        return tomorrow;
    }

    getPreviousTimestamp(timestamp: Date): Date  {
        const yesterday =  new Date(timestamp.getTime());
        yesterday.setDate(timestamp.getDate() - 1);
        return yesterday;
    }

    setToGranularityStart(timestamp: Date): Date {
        const start = new Date(timestamp.getTime());
        start.setHours(0, 0, 0, 0);
        return start;
    }
    
    setToGranularityEnd(timestamp: Date): Date {
        const end = new Date(timestamp.getTime());
        end.setHours(23, 59, 59, 999);
        return end;
    }
}