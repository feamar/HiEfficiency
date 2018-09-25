export default class UtilityArray 
{
    static move = <T> (array: T[], from: number, count: number, to: number) =>
    {
        if(from == to)
        {   return array;}
        
        var args: number[] = [from > to ? to : to - count, 0];
        args.push.apply(args, array.splice(from, count));
        array.splice.apply(array, args);
    
        return array;
    }

    static getRemoved = <T> (original: T[], next: T[]) =>
    {
        const removed = [];
        for(var i = 0 ; i < original.length ; i++)
        {
            const current = original[i];
            if(next.includes(current) == false)
            {   removed.push(current);}
        }

        return removed;
    }

    static getAdded = <T> (original: T[], next: T[]) =>
    {
        const added = [];
        for(var i = 0 ; i < next.length ; i++)
        {
            const current = next[i];
            if(original.includes(current) == false)
            {   added.push(current);}
        }

        return added;
    }

    static getUnchanged = <T> (original: T[], next: T[]) =>
    {
        const unchanged = [];
        for(var i = 0 ; i < original.length ; i ++)
        {
            const current = original[i];
            if(next.includes(current))
            {   unchanged.push(current);}
        }

        return unchanged;
    }

    static clean = <T> (array: T[], deleteValue: T) =>
    {
        for (var i = 0; i < array.length; i++) 
        {
          if (array[i] == deleteValue) 
          {         
            array.splice(i, 1);
            i--;
          }
        }

        return array;
    };
}