export default class UtilityUpdate
{
    /**
     * Utility method that observes an input object's shallow fields and returns an object that declares each field as an update ($set) for {@link immutability-helper}'s {@link update} method.
     */
    public static getUpdatesFromShallowObject = (obj: any) : object =>
    {
        const updates: any = {
            
        };
        const keys: string[] = Object.keys(obj);
        for(var i: number = 0 ; i < keys.length ; i ++)
        {
            const key: string = keys[i];
            const value: any = obj[key];

            updates[key] = {$set: value};
        }

        return updates;
    }
}