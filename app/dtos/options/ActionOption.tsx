export default class ActionOption
{
    public text: string;
    public id: string;

    constructor (id: string, text: string)
    {
        this.text = text;
        this.id = id;
    }
}