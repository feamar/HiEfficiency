export default class UtilityAsync
{
    static sleep = (milliseconds) => 
    {   return new Promise(resolve => setTimeout(resolve, milliseconds))}

    static setState = (component, updates) =>
    {   return new Promise(resolve => component.setState(updates, () => {resolve()}));}
}