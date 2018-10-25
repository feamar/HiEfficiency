import Color from "../dtos/color/Color";

class EnumEnforcer {}
const EnforcerInstance = new EnumEnforcer();

export default class InterruptionType
{
    public readonly dbId: number;
    public readonly iconColor: Color;
    public readonly iconName: string;
    public readonly title: string;

    constructor(enforcer: EnumEnforcer, dbId: number, iconColor: Color, iconName: string, title: string)
    {
        if(enforcer !== EnforcerInstance)
        {   throw new Error("You cannot create additional enum values at runtime.");}
    
        this.dbId = dbId;
        this.iconColor = iconColor;
        this.iconName = iconName;
        this.title = title;
    }

    //ATTENTION: Do not change the integer ids of the enum values. 
    //Additionally, when creating new instances, always use a higher integer value than the highest number now available.
    //Finally, when removing an instance that currently has the highest id, place a comment indicating the number, so that others wont add new values with that same id.
    static readonly Meeting = new InterruptionType(EnforcerInstance, 0, Color.fromName("purple")!, "chat", "Meeting");
    static readonly WaitingForOthers = new InterruptionType(EnforcerInstance, 1, Color.fromName("orange")!, "people",  "Waiting");
    static readonly Other = new InterruptionType(EnforcerInstance, 2, Color.fromName("blue")!, "add", "Other");
    static readonly None = new InterruptionType(EnforcerInstance, 3, Color.fromName("black")!, "help", "None");

    static readonly Values: Array<InterruptionType> = [
        InterruptionType.Meeting, 
        InterruptionType.WaitingForOthers, 
        InterruptionType.Other
    ];

    static readonly fromDatabaseId = (dbId: number): InterruptionType => 
    {   
        var type = InterruptionType.Values.find(e => e.dbId == dbId);
        if(type == undefined)
        {   type = InterruptionType.None;}
        
        return type;
    }
}