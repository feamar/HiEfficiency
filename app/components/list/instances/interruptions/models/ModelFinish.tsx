import AbstractInterruptionModel from "./AbstractInterruptionModel";

export default class ModelFinish extends AbstractInterruptionModel
{
    static is = (obj: any): obj is ModelFinish =>
    {   return obj.constructor == ModelFinish;}

    public finishedOn: Date;
    constructor(finishedOn: Date)
    {   
        super(finishedOn, 0);
        this.finishedOn = finishedOn;
    }
}