
class EnumEnforcer {}
const EnforcerInstance = new EnumEnforcer();

export default class InterruptionType
{
    constructor(enforcer, dbId, iconColor, iconName, title)
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
    static Meeting = new InterruptionType(EnforcerInstance, 0, "purple", "chat", "Meeting");
    static WaitingForOthers = new InterruptionType(EnforcerInstance, 1, "orange", "people",  "Waiting");
    static Other = new InterruptionType(EnforcerInstance, 2, "blue", "add", "Other");
    static None = new InterruptionType(EnforcerInstance, 3, "black", "help", "None");

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