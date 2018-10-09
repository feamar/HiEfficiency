import { AnyAction } from "redux";

export default class AbstractReduxAction
{
    public type: string;

    constructor(type: string)
    {
        this.type = type;
    }

    toPlainObject = (): AnyAction =>
    {
        return Object.assign({}, this);
    }
}