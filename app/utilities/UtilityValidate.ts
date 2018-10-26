export default class UtilityValidate 
{
    /**
     * A default legal character set, that is a subset of the ASCII scheme. 
     */
    public static readonly DEFAULT_LEGAL_CHARACTERS = "\n[]{}ÁÉÚÍÓÀÈÌÙÒÄËÜÖÏÂÊÛÎÔçáéúíóàèìòùâêûîôäëüïöABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-=!@#$%^&*()_+€|:\";',./<>?~ ";

    /**
     * A utility method that checks an input string for the occurrence of illegal characters, given a string containing white-listed/legal characters.
     * @param value - The string to validate for illegal characters.
     * @param legalCharacters - The set of characters that are considered legal.
     * @returns A string containing all the illegal characters that have been observed. Each illegal character is included in order and guaranteed to be included only once.
     */
    public static getIllegalCharacters = (value: string, legalCharacters: string) : string =>
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