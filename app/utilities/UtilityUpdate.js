export default class UtilityUpdate
{
    static getUpdatesFromShallowObject = (obj) =>
    {
        const updates = {};
        const keys = Object.keys(obj);
        for(var i = 0 ; i < keys.length ; i ++)
        {
            const key = keys[i];
            const value = obj[key];

            updates[key] = {$set: value};
        }

        return updates;
    }
}