import AbstractInterruptionModel from "./AbstractInterruptionModel";

export default class ModelProductive extends AbstractInterruptionModel
{
    static is = (obj: any): obj is ModelProductive =>
    {   return obj.constructor == ModelProductive;}

    constructor(timestamp: Date, duration: number)
    {   
        super(timestamp, duration);
    }
}