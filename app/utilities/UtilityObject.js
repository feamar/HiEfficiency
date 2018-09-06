export default class UtilityObject 
{
    static stringify = (object) =>
    {   return JSON.stringify(JSON.decycle(object));}

    static inspect = (object, indentation) =>
    {
        if(object == undefined || object == null)
        {   
            console.log("Inspection cannot happen on undefined or null object.");
            return;
        }

        if(indentation == undefined || indentation == null)
        {   indentation = 0;}

        object = JSON.decycle(object);

        var whitespace = "";
        for(var i = 0 ; i < indentation ; i ++)
        {   whitespace += "     ";}

        const keys = Object.keys(object);
        for(var i = 0 ; i < keys.length ; i ++)
        {
            const key = keys[i];
            const value = object[key];

            if(value instanceof Date)
            {
                console.log(whitespace + "date " + key + ": " + value);
            }
            else if(typeof value === 'object')
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