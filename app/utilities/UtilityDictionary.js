
export default class UtilityDictionary
{
    static toArray = (dictionary) =>
    {
        const keys = Object.getKeys(dictionary);
        return keys.map((key, index) => { return dictionary[key]})
    }
}