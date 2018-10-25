import Color from "../dtos/color/Color";

class EnumEnforcer {}
const EnforcerInstance = new EnumEnforcer();

export default class StoryType
{
    public readonly id: number;
    public readonly name: string;
    public readonly color: Color;
    public readonly icon?: string;

    constructor(enforcer: EnumEnforcer, id: number, name: string, color: Color, icon?: string)
    {
        if(enforcer !== EnforcerInstance)
        {   throw new Error("You cannot create additional enum values at runtime.");}

        this.id = id;
        this.name = name;
        this.color = color;
        this.icon = icon;
    }

    static readonly Bug = new StoryType(EnforcerInstance, 0, "Bug", Color.fromHexadecimal("#565656"));
    static readonly Task = new StoryType(EnforcerInstance, 1, "Task", Color.fromHexadecimal("#3C5C71"));
    static readonly Improvement = new StoryType(EnforcerInstance, 2, "Improvement", Color.fromHexadecimal("#3C7162"));
    static readonly Feature = new StoryType(EnforcerInstance, 3, "Feature", Color.fromHexadecimal("#65A9AD"));

    static readonly Values: Array<StoryType> = [
        StoryType.Bug, 
        StoryType.Task, 
        StoryType.Improvement,
        StoryType.Feature
    ];
  
    static readonly fromName = (name: string): StoryType | undefined => 
    {   return StoryType.Values.find(e => e.name == name);}

    static readonly fromId = (id: number): StoryType | undefined => 
    {   return StoryType.Values.find(e => e.id == id);}
}