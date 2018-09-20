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
    {   return DatabaseActionType.Values.find(e => e.pastTense == pastTense);}

    static fromPresentTense = (presentTense) => 
    {   return DatabaseActionType.Values.find(e => e.presentTense == presentTense);}

    static fromPresentContinuous = (presentContinuous) => 
    {   return DatabaseActionType.Values.find(e => e.presentContinuous == presentContinuous);}
}