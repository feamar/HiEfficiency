export default class ProcessEfficiency
{
    public readonly productiveTime: number;
    public readonly interruptionTime: number;
    public readonly usernames: Array<string>;
    public readonly potentialTime: number;

    public get processEfficiency()
    {   return (this.totalTime - this.interruptionTime) / this.totalTime;};

    public get totalTime()
    {   return this.productiveTime + this.interruptionTime;}

    constructor(potentialTime: number, productiveTime: number, interruptionTime: number, usernames: Array<string>)
    {
        //TODO: Prohibit incorrect input in user interface.

        this.productiveTime = productiveTime;
        this.potentialTime = potentialTime;
        this.interruptionTime = interruptionTime;
        this.usernames = usernames;
    }
}