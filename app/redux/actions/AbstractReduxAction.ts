export default class AbstractReduxAction
{
    public type: string;

    constructor(type: string)
    {
        this.type = type;
    }
}