
class EnumEnforcer {}
const EnforcerInstance = new EnumEnforcer();

export default class InterruptionType
{
    constructor(enforcer, dbId, iconColor, iconName, interruptionCategory, title)
    {
        if(enforcer !== EnforcerInstance)
        {   throw new Error("You cannot create additional enum values at runtime.");}
    
        this.dbId = dbId;
        this.iconColor = iconColor;
        this.iconName = iconName;
        this.interruptionCategory = interruptionCategory;
        this.title = title;
    }

    static Meeting = new InterruptionType(EnforcerInstance, "meeting", "purple", "chat", "meeting", "Meeting");
    static WaitingForOthers = new InterruptionType(EnforcerInstance, "waiting", "orange", "people", "waiting", "Waiting");
    static Other = new InterruptionType(EnforcerInstance, "other", "blue", "add", "other", "Other");
    static None = new InterruptionType(EnforcerInstance, undefined, "black", "help", undefined, undefined);

    static Values = [
        InterruptionType.Meeting, 
        InterruptionType.WaitingForOthers, 
        InterruptionType.Other
    ];
  
    static fromDatabaseId = (dbId) => 
    {
        for(i = 0 ; i < InterruptionType.Values.length ; i ++)
        {
            let current = InterruptionType.Values[i];
            if(current.dbId == dbId)
            {   return current;}
        }

        return InterruptionType.None;
    }
}