import AbstractModel from "./AbstractModel";
import Color from "../../../../../dtos/color/Color";
import ListItemInterruption from "../../../../lists/instances/interruptions/ListItemInterruption";

export default class ModelInterruption extends AbstractModel
{
    public timestamp: Date;
    public duration: number;
    public title: string;
    public iconName: string;
    public iconColor: Color;

    constructor(timestamp: Date, duration: number, title: string, iconName: string, iconColor: Color)
    {   
        super(ListItemInterruption);

        this.timestamp = timestamp;
        this.duration = duration;
        this.title = title;
        this.iconName = iconName;
        this.iconColor = iconColor;
    }
}