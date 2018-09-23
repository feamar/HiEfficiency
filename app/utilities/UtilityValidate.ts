export default class UtilityValidate 
{
    static readonly DEFAULT_LEGAL_CHARACTERS = "[]{}ÁÉÚÍÓÀÈÌÙÒÄËÜÖÏÂÊÛÎÔçáéúíóàèìòùâêûîôäëüïöABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-=!@#$%^&*()_+€|:\";',./<>?~ ";


    static getIllegalCharacters = (value: string, legalCharacters: string) : string =>
    {
        var illegal: string = "";
        for(var i: number = 0 ; i < value.length ; i ++)
        {
            const char: string = value[i];
            if(legalCharacters.includes(char) == false && illegal.includes(char) == false)
            {   illegal += char;}
        }

        return illegal;
    }
}