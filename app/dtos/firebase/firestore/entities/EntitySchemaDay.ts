export default class EntitySchemaDay 
{
    static fromJsonObject = (json: any): EntitySchemaDay =>
    {   return new EntitySchemaDay(json.start, json.end, json.enabled);}

    static create(start:string, end: string, enabled: boolean) : EntitySchemaDay
    {   return new EntitySchemaDay(start, end, enabled);}

    static defaultWorkDay () : EntitySchemaDay
    {   return new EntitySchemaDay("09:00", "17:00", true);}

    static defaultWeekendDay () : EntitySchemaDay
    {   return new EntitySchemaDay("09:00", "17:00", false);}

    public start: string;
    public end: string;
    public enabled: boolean;

    private constructor(start: string, end: string, enabled: boolean)
    {
        this.start = start;
        this.end = end;
        this.enabled = enabled;
    }

    getHours = () =>
    {
        if(this.enabled == false)
        {   return 0;}
        
        const splitStart = this.start.split(":");
        const splitEnd = this.end.split(":");

        const endAmount = parseInt(splitEnd[0]);
        const startAmount = parseInt(splitStart[0]);

        return endAmount - startAmount;
    }

    getMillisecondsOnDay = (day: Date, mode: "End" | "Start") =>
    {
        const milliseconds = day.getTime() % 86400000;
        const start = this.getStartAsMilliseconds();
        const end = this.getEndAsMilliseconds();

        if(mode == "Start")
        {
            if(milliseconds > end)
            {   return 0;}
            
            if(milliseconds < start)
            {   return end - start;}
    
            return end - milliseconds; 
        }
        else
        {
            if(milliseconds < start)
            {   return 0;}

            if(milliseconds > end)
            {   return end - start;}

            return milliseconds - start;
        }
    }

    getStartAsMilliseconds = () =>
    {   return this.getAsMilliseconds(this.start);}

    getEndAsMilliseconds = () =>
    {   return this.getAsMilliseconds(this.end);}

    getStartHourComponent = () =>
    {
        return parseInt(this.start.split(":")[0]);
    }

    getStartMinuteComponent = () =>
    {
        return parseInt(this.start.split(":")[1]);
    }
    
    getEndHourComponent = () =>
    {
        return parseInt(this.end.split(":")[0]);
    }

    getEndMinuteComponent = () =>
    {
        return parseInt(this.end.split(":")[1]);
    }

    private getAsMilliseconds = (value: string) =>
    {
        const split = value.split(":");
        const hours = parseInt(split[0]) * 60 * 60 * 1000;
        const minutes = parseInt(split[1]) * 60 * 1000;

        return hours + minutes;
    }
}