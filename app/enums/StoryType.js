import Color from 'react-native-material-color';

class EnumEnforcer {}
const EnforcerInstance = new EnumEnforcer();

export default class StoryType
{
    constructor(enforcer, id, name, color, icon)
    {
        if(enforcer !== EnforcerInstance)
        {   throw new Error("You cannot create additional enum values at runtime.");}

        this.id = id;
        this.name = name;
        this.color = color;
        this.icon = icon;
    }

    static Bug = new StoryType(EnforcerInstance, 0, "Bug", Color.RED[500], undefined);
    static Task = new StoryType(EnforcerInstance, 1, "Task", "#3C5C71", undefined);
    static Improvement = new StoryType(EnforcerInstance, 2, "Improvement", "#3C7162", undefined);
    static Feature = new StoryType(EnforcerInstance, 3, "Feature", "#65A9AD", undefined);

    static Values = [
        StoryType.Bug, 
        StoryType.Task, 
        StoryType.Improvement,
        StoryType.Feature
    ];
  
    static fromName = (name) => 
    {
        for(i = 0 ; i < StoryType.Values.length ; i ++)
        {
            let current = StoryType.Values[i];
            if(current.name == name)
            {   return current;}
        }

        return undefined;
    }

    static fromId = (id) => 
    {
        for(i = 0 ; i < StoryType.Values.length ; i ++)
        {
            let current = StoryType.Values[i];
            if(current.id == id)
            {   return current;}
        }

        return undefined;
    }
}