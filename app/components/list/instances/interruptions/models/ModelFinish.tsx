import ListItemFinish from "../ListItemFinish";
import AbstractModel from "./AbstractModel";

export default class ModelFinish extends AbstractModel
{
    public finishedOn: Date;

    constructor(finishedOn: Date)
    {   
        super(ListItemFinish);
        this.finishedOn = finishedOn;
    }
}