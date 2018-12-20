import UtilityNumber from "./UtilityNumber";

export default class UtilityDate
{
    static areOnSameDay = (d1: Date, d2: Date) =>
    {
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    }
    
    public static getDayNameFull = (timestamp: Date) =>
    {
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][timestamp.getDay()];
    }

    public static getDayNameAbbreviated = (dayOfWeek: number) =>
    {
        const abbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return abbreviations[dayOfWeek] || " ";
    }

    public static getWeekNumber = (timestamp: Date) =>
    {
        const date = new Date(timestamp.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        var week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    public static dateToString = (timestamp: Date, separator: string = "/") =>
    {
        const year = timestamp.getFullYear();
        const month = UtilityNumber.pad(timestamp.getMonth(), 2, "0");
        const day = UtilityNumber.pad(timestamp.getDate(), 2, "0");

        return [day, month, year].join(separator);
    }
}