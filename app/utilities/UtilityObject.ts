import UtilityJson from "./UtilityJson";

export default class UtilityObject 
{
    static deserialize = <T> (json: {[index: string]: any}, prototype: object) : T =>
    {
        const instance = Object.create(prototype);
        const keys = Object.keys(instance);

        console.log("KEYS");
        keys.forEach(key => 
        {
           console.log("KEY: " + key); 
           instance[key] = json[key];
        });
        return instance;
    } 

    static stringify = (object: object) : string =>
    {   return JSON.stringify(UtilityJson.decycle(object));}

    static inspect = (object: any, indentation?: number) =>
    {
        if(object == undefined || object == null)
        {   
            console.log("Inspection cannot happen on undefined or null object.");
            return;
        }

        if(indentation == undefined)
        {   indentation = 0;}

        object = UtilityJson.decycle(object);

        var whitespace: string = "";
        for(var i = 0 ; i < indentation ; i ++)
        {   whitespace += "     ";}

        const keys: string[] = Object.keys(object);
        for(var i = 0 ; i < keys.length ; i ++)
        {
            const key: string = keys[i];
            const value: any = object[key];

            if(value instanceof Date)
            {   console.log(whitespace + "date " + key + ": " + value);}
            else if(typeof value === 'object')
            {
                console.log(whitespace + "object " + key + ":");
                UtilityObject.inspect(value, indentation + 1);
            }
            else if(typeof value === 'function')
            {   console.log(whitespace + "function " + key);}
            else
            {   console.log(whitespace + "variable " + key + " = " + value);}
        }
    }
}