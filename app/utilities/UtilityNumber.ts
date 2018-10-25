export default class UtilityNumber
{
    static pad = (value: number, amount: number, padding?: string) : string =>
    {
        if(padding == undefined)
        {   padding = "0";}
        const stringValue: string = value.toString();

        const difference: number = amount - stringValue.length;
        if(difference > 0 )
        {   
            const prefix = new Array(difference).join(padding) + padding;
            return prefix + stringValue;
        }
        else
        {   return stringValue;}
    }
}