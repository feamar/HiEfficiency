import AbstractInterruptionModel from "./AbstractInterruptionModel";

export default class ModelStart extends AbstractInterruptionModel
{
    static is = (obj: any): obj is ModelStart =>
    {   return obj.constructor == ModelStart;}

    public startedOn: Date;

    constructor(startedOn: Date)
    {   
        super(startedOn, 0);
        this.startedOn = startedOn;
    }
}