export default class UtilityNumber
{
    static pad = (value: number, amount: number, padding?: string) : string =>
    {
        if(padding == undefined)
        {   padding = "0";}

        const desiredLength: number = Math.pow(10, amount - 1);
        const stringValue: string = value.toString();

        const difference: number = desiredLength - stringValue.length;
        if(difference > 0 )
        {   return new Array(difference).join(padding) + stringValue;}
        else
        {   return stringValue;}
    }
}