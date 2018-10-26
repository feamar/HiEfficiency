import EntitySchemaDay from "./EntitySchemaDay";
import UtilityType from "../../../../utilities/UtilityType";

export default class EntitySchemaWeek
{
    static fromJsonObject(json: any) : EntitySchemaWeek
    {   return new EntitySchemaWeek(EntitySchemaDay.fromJsonObject(json.monday), EntitySchemaDay.fromJsonObject(json.tuesday), EntitySchemaDay.fromJsonObject(json.wednesday), EntitySchemaDay.fromJsonObject(json.thursday), EntitySchemaDay.fromJsonObject(json.friday), EntitySchemaDay.fromJsonObject(json.saturday), EntitySchemaDay.fromJsonObject(json.sunday));}

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

    getDayOfDate = (date: Date) =>
    {
        const index = (date.getDay() + 1) % 7;
        return this.getByIndex(index)!;
    }

    getTotalHours = () =>
    {
        var accrued = 0;
        this.forEachDay((day, _index) => 
        {   accrued += day.getHours();});
        return accrued;
    }

    forEachDay = <T> (closure: (day: EntitySchemaDay, index: number) => T) =>
    {
        const results: Array<T> = [];
        for(var i = 0 ; i < 7 ; i ++)
        {
            const current = this.getByIndex(i);
            const result = closure(current!, i);
            results.push(result);
        }

        return results;
    }

    getByIndex = (i: number) : EntitySchemaDay | undefined => 
    {   
        switch(i)
        {
            case 0: return this.monday;
            case 1: return this.tuesday;
            case 2: return this.wednesday;
            case 3: return this.thursday;
            case 4: return this.friday;
            case 5: return this.saturday;
            case 6: return this.sunday;

            default: return undefined;
        }
    }

    static getPropertyByIndex = (i: number) : keyof EntitySchemaWeek | undefined =>
    {
        switch(i)
        {
            case 0: return UtilityType.nameof<EntitySchemaWeek>("monday");
            case 1: return UtilityType.nameof<EntitySchemaWeek>("tuesday");
            case 2: return UtilityType.nameof<EntitySchemaWeek>("wednesday");
            case 3: return UtilityType.nameof<EntitySchemaWeek>("thursday");
            case 4: return UtilityType.nameof<EntitySchemaWeek>("friday");
            case 5: return UtilityType.nameof<EntitySchemaWeek>("saturday");
            case 6: return UtilityType.nameof<EntitySchemaWeek>("sunday");

            default: return undefined;
        }
    }

}