export default class UtilityArray 
{
    static move = (array, from, count, to) =>
    {
        if(from == to)
        {   return array;}
        
        var args = [from > to ? to : to - count, 0];
        args.push.apply(args, array.splice(from, count));
        array.splice.apply(array, args);
    
        return array;
    }

    static getRemoved =     (original, next) =>
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

    static getAdded = (original, next) =>
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

    static getUnchanged = (original, next) =>
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

    static clean = (array, deleteValue) =>
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