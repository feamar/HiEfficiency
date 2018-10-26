export default class UtilityMap
{
    static map = <K, V, R> (map: Map<K, V>, closure: (key: K, value: V) => R) =>
    {
        const results: Array<R> = [];
        for(var [key, value] of map)
        {   
            results.push(closure(key, value));
        }
        return results;
    }

    static getRemoved = <K, V> (original: Map<K, V>, next: Map<K, V>) =>
    {
        const removed = [];
        for(var [key, value] of original)
        {
            if(next.has(key) == false)
            {   removed.push(value)}
        }

        return removed;
    }

    static getAdded = <K, V> (original: Map<K, V>, next: Map<K, V>) =>
    {
        const added = [];
        for(var [key, value] of next)
        {
            if(original.has(key) == false)
            {   added.push(value)}
        }

        return added;
    }

    static getUnchanged = <K, V> (original: Map<K, V>, next: Map<K, V>) =>
    {
        const unchanged = [];
        for(var [key, value] of original)
        {
            if(next.has(key))
            {   unchanged.push(value)}
        }

        return unchanged;
    }

    static toArray = <K, V> (map: Map<K, V>): Array<V> =>
    {
        const result: Array<V> = [];
        for(var [key] of map)
        {   result.push(map.get(key)!);}

        return result;
    }
}