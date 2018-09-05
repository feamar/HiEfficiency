export default class UtilityObject 
{
    static stringify = (object) =>
    {   console.log(JSON.stringify(JSON.decycle(object)));}

    static inspect = (object, indentation) =>
    {
        if(object == undefined || object == null)
        {   return;}

        object = JSON.decycle(object);

        var whitespace = "";
        for(var i = 0 ; i < indentation ; i ++)
        {   whitespace += " ";}

        const keys = Object.keys(object);
        for(var i = 0 ; i < keys.length ; i ++)
        {
            const key = keys[i];
            const value = object[key];

            if(typeof value === 'object')
            {
                console.log(whitespace + "object " + key + ":");
                UtilityObject.inspect(value, indentation + 1);
            }
            else if(typeof value === 'function')
            {
                console.log(whitespace + "function " + key);
            }
            else
            {
                console.log(whitespace + "variable " + key + " = " + value);
            }
        }
    }
}