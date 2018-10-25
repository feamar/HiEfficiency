import Color from "../../../../../dtos/color/Color";
import InterruptionType from "../../../../../enums/InterruptionType";
import AbstractInterruptionModel from "./AbstractInterruptionModel";

export default class ModelInterruption extends AbstractInterruptionModel
{
    static is = (obj: any): obj is ModelInterruption =>
    {   return obj.constructor == ModelInterruption;}

    public title: string;
    public iconName: string;
    public iconColor: Color;
    public index: number;
    public type: InterruptionType;

    constructor(timestamp: Date, duration: number | undefined, title: string, iconName: string, index: number, type: InterruptionType, iconColor: Color = Color.fromHexadecimal("#919191"))
    {   
        super(timestamp, duration);
        this.type = type;
        this.timestamp = timestamp;
        this.title = title;
        this.iconName = iconName;
        this.iconColor = iconColor;
        this.index = index;
    }
}