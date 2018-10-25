import UtilityArray from "./UtilityArray";

export default class UtilityIndexable
{
    static toArray = <V> (indexable: {[index: string]: V}) =>
    {
        const keys = Object.keys(indexable);
        return keys.map(key => indexable[key]);
    }

    static getRemoved = <V> (original: {[index: string]: V}, next: {[index: string]: V}) =>
    {   return UtilityArray.getRemoved(UtilityIndexable.toArray(original), UtilityIndexable.toArray(next));}

    static getAdded = <V> (original: {[index: string]: V}, next: {[index: string]: V}) =>
    {   return UtilityArray.getAdded(UtilityIndexable.toArray(original), UtilityIndexable.toArray(next));}

    static getUnchanged = <V> (original: {[index: string]: V}, next: {[index: string]: V}) =>
    {   return UtilityArray.getUnchanged(UtilityIndexable.toArray(original), UtilityIndexable.toArray(next));}
}