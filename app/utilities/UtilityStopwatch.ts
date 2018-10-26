export default class UtilityStopwatch
{
    public timeStart?: Date;

    constructor()
    {

    }

    start = () =>
    {
        this.timeStart = new Date();
    }

    time = () => 
    {
        if(this.timeStart == undefined)
        {   return -1;}

        return new Date().getTime() - this.timeStart.getTime();
    }

    log = (module: string, method: string, message: string) =>
    {
        const time = this.time();
        console.log(time + "        " + module + " - " + method + " - " + message);
    }

    finish = () =>
    {
        this.timeStart = undefined;
    }
}