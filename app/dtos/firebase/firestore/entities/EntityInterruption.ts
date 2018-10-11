export default class EntityInterruption
{
    static fromJsonObject = (json: any): EntityInterruption =>
    {   return new EntityInterruption(json.category, json.timestamp, json.duration);}
    
    static create(category: number, timestamp: Date, duration?: number)
    {   return new EntityInterruption(category, timestamp, duration);}

    public category: number;
    public timestamp: Date;
    public duration?: number;

    private constructor(category: number, timestamp: Date,  duration?: number)
    {
        this.category = category;
        this.timestamp = timestamp;
        this.duration = duration;
    }

}