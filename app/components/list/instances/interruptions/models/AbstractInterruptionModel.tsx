export default class AbstractInterruptionModel
{
    public timestamp: Date;
    public duration?: number;

    constructor(timestamp: Date, duration?: number)
    {   
        this.timestamp = timestamp;
        this.duration = duration;
    }
}