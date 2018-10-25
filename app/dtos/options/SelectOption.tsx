export default class SelectOption
{
    static readonly FEEDBACK = [new SelectOption(0, "Bug"), new SelectOption(1, "Feature Request"), new SelectOption(2, "Other")];

    value: string;
    id: number;
    
    constructor(id: number, value: string)
    {
        this.id = id;
        this.value = value;
    }
}

