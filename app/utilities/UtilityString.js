export default class UtilityString
{
    static capitalizeFirstLetter = (input) => 
    {   return input.charAt(0).toUpperCase() + input.slice(1);}
}