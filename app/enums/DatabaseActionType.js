import Color from 'react-native-material-color';

class EnumEnforcer {}
const EnforcerInstance = new EnumEnforcer();

export default class DatabaseActionType
{
    constructor(enforcer, pastTense, presentTense, presentContinuous)
    {
        if(enforcer !== EnforcerInstance)
        {   throw new Error("You cannot create additional enum values at runtime.");}

        this.pastTense = pastTense;
        this.presentTense = presentTense;
        this.presentContinuous = presentContinuous;
    }

    static Update = new DatabaseActionType(EnforcerInstance, "updated", "update", "updating");
    static Delete = new DatabaseActionType(EnforcerInstance, "deleted", "delete", "deleting");
    static Create = new DatabaseActionType(EnforcerInstance, "created", "create", "creating");
    static Join   = new DatabaseActionType(EnforcerInstance, "joined", "join", "joining");
    static Leave  = new DatabaseActionType(EnforcerInstance, "left", "leave", "leaving");

    static Values = [
        DatabaseActionType.Update, 
        DatabaseActionType.Delete, 
        DatabaseActionType.Create, 
    ];
  
    static fromPastTense = (pastTense) => 
    {
        for(i = 0 ; i < DatabaseActionType.Values.length ; i ++)
        {
            let current = DatabaseActionType.Values[i];
            if(current.pastTense == pastTense)
            {   return current;}
        }

        return undefined;
    }

    static fromPresentTense = (presentTense) => 
    {
        for(i = 0 ; i < DatabaseActionType.Values.length ; i ++)
        {
            let current = DatabaseActionType.Values[i];
            if(current.presentTense == presentTense)
            {   return current;}
        }

        return undefined;
    }
}