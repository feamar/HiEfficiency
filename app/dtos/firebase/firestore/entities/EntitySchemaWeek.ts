import EntitySchemaDay from "./EntitySchemaDay";
import UtilityType from "../../../../utilities/UtilityType";

export default class EntitySchemaWeek
{
    static fromArray(schema: Array<EntitySchemaDay>) : EntitySchemaWeek
    {   return new EntitySchemaWeek(schema[0], schema[1], schema[2], schema[3], schema[4], schema[5], schema[6]);}

    static fromDays(monday: EntitySchemaDay, tuesday: EntitySchemaDay, wednesday: EntitySchemaDay, thursday: EntitySchemaDay, friday: EntitySchemaDay, saturday: EntitySchemaDay, sunday: EntitySchemaDay)
    {   return new EntitySchemaWeek(monday, tuesday, wednesday, thursday, friday, saturday, sunday);}

    static default() : EntitySchemaWeek
    {   
        const workDay = EntitySchemaDay.defaultWorkDay();
        const weekendDay = EntitySchemaDay.defaultWeekendDay();

        return new EntitySchemaWeek(workDay, workDay, workDay, workDay, workDay, weekendDay, weekendDay);
    }
    
    public monday: EntitySchemaDay;
    public tuesday: EntitySchemaDay;
    public wednesday: EntitySchemaDay;
    public thursday: EntitySchemaDay;
    public friday: EntitySchemaDay;
    public saturday: EntitySchemaDay;
    public sunday: EntitySchemaDay;

    constructor(monday: EntitySchemaDay, tuesday: EntitySchemaDay, wednesday: EntitySchemaDay, thursday: EntitySchemaDay, friday: EntitySchemaDay, saturday: EntitySchemaDay, sunday: EntitySchemaDay)
    {   
        this.monday = monday;
        this.tuesday = tuesday;
        this.wednesday = wednesday;
        this.thursday = thursday;
        this.friday = friday;
        this.saturday = saturday;
        this.sunday = sunday;
    }

    getTotalHours = () =>
    {
        return this.toArray().reduce((accrued: number, current: EntitySchemaDay) =>
        {   return accrued + current.getHours();}, 0);
    }

    getByIndex = (i: number) : EntitySchemaDay => 
    {   return this.toArray()[i];}

    static getPropertyByIndex = (i: number) : keyof EntitySchemaWeek | undefined =>
    {
        switch(i)
        {
            case 0: UtilityType.nameof<EntitySchemaWeek>("monday");
            case 1: UtilityType.nameof<EntitySchemaWeek>("tuesday");
            case 2: UtilityType.nameof<EntitySchemaWeek>("wednesday");
            case 3: UtilityType.nameof<EntitySchemaWeek>("thursday");
            case 4: UtilityType.nameof<EntitySchemaWeek>("friday");
            case 5: UtilityType.nameof<EntitySchemaWeek>("saturday");
            case 6: UtilityType.nameof<EntitySchemaWeek>("sunday");

            default: return undefined;
        }
    }

    toArray = () : Array<EntitySchemaDay> =>
    {   return [this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday, this.sunday];}
}