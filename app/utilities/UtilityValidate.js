export default class UtilityValidate 
{
    static DEFAULT_LEGAL_CHARACTERS = "[]{}ÁÉÚÍÓÀÈÌÙÒÄËÜÖÏÂÊÛÎÔçáéúíóàèìòùâêûîôäëüïöABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-=!@#$%^&*()_+€|:\";',./<>?~ ";


    static getIllegalCharacters = (value, legalCharacters) =>
    {
        var illegal = "";
        for(var i = 0 ; i < value.length ; i ++)
        {
            const char = value[i];
            if(legalCharacters.includes(char) == false && illegal.includes(char) == false)
            {   illegal += char;}
        }

        return illegal;
    }
}