export default class EntitySchemaDay 
{
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
        const splitStart = this.start.split(":");
        const splitEnd = this.end.split(":");

        const endAmount = parseInt(splitEnd[0]);
        const startAmount = parseInt(splitStart[0]);

        return endAmount - startAmount;
    }
}