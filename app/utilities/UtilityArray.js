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
}