export default class UtilityAsync
{
    static sleep = (milliseconds) => 
    {   return new Promise(resolve => setTimeout(resolve, milliseconds))}
}