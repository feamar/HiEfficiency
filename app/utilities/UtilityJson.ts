export default class UtilityJson
{
    static decycle = (object: any, replacer?: any) =>
    {
        var objects: WeakMap<object, any> = new WeakMap();
        return (function derez(value, path) 
        {
          var old_path;
          var nu: any;
  
          if (replacer !== undefined) 
          {     value = replacer(value);}
  
          if (
            typeof value === "object"
            && value !== null
            && !(value instanceof Boolean)
            && !(value instanceof Date)
            && !(value instanceof Number)
            && !(value instanceof RegExp)
            && !(value instanceof String)
          ) 
          {
            old_path = objects.get(value);
            if (old_path !== undefined) 
            {   return { $ref: old_path };}
  
            objects.set(value, path);
  
            if (Array.isArray(value)) 
            {
              nu = [];
              value.forEach(function (element, i) 
              {     nu[i] = derez(element, path + "[" + i + "]");});
            } 
            else 
            {
              nu = {};
              Object.keys(value).forEach(function (name) 
              {
                nu[name] = derez(
                  value[name],
                  path + "[" + JSON.stringify(name) + "]"
                );
              });
            }
            return nu;
          }
          return value;
        }(object, "$"));
      };
}