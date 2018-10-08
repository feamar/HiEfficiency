class EnumEnforcer {}
const EnforcerInstance = new EnumEnforcer();

export default class DatabaseActionType
{
    public readonly pastTense: string;
    public readonly presentTense: string;
    public readonly presentContinuous: string;

    constructor(enforcer: EnumEnforcer, pastTense: string, presentTense: string, presentContinuous: string)
    {
        if(enforcer !== EnforcerInstance)
        {   throw new Error("You cannot create additional enum values at runtime.");}

        this.pastTense = pastTense;
        this.presentTense = presentTense;
        this.presentContinuous = presentContinuous;
    }

    static readonly Update = new DatabaseActionType(EnforcerInstance, "updated", "update", "updating");
    static readonly Delete = new DatabaseActionType(EnforcerInstance, "deleted", "delete", "deleting");
    static readonly Create = new DatabaseActionType(EnforcerInstance, "created", "create", "creating");
    static readonly Join   = new DatabaseActionType(EnforcerInstance, "joined", "join", "joining");
    static readonly Leave  = new DatabaseActionType(EnforcerInstance, "left", "leave", "leaving");

    static readonly Values: Array<DatabaseActionType> = [
        DatabaseActionType.Update, 
        DatabaseActionType.Delete, 
        DatabaseActionType.Create, 
    ];
  
    static readonly fromPastTense = (pastTense: string) => 
    {   return DatabaseActionType.Values.find(e => e.pastTense == pastTense);}

    static readonly fromPresentTense = (presentTense: string) => 
    {   return DatabaseActionType.Values.find(e => e.presentTense == presentTense);}

    static readonly fromPresentContinuous = (presentContinuous: string) => 
    {   return DatabaseActionType.Values.find(e => e.presentContinuous == presentContinuous);}
}