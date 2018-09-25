import UtilityNumber from "./UtilityNumber";

export default class UtilityTime
{
    public static readonly DEFAULT_TIME_SEPARATOR = ":";

    /**
     * Utility method that converts a millisecond duration to an HH MM SS format.
     * @param milliseconds - The millisecond duration to convert.
     * @param separator - The separator to use between the HH, MM and SS instances of the result. Defaults to {@link DEFAULT_TIME_SEPARATOR}.
     * @returns An HH MM SS string representation of the duration.
     */
    public static millisecondsToHHMMSS = (milliseconds: number, separator: string = UtilityTime.DEFAULT_TIME_SEPARATOR) : string =>
    {
        const seconds: number = Math.round(milliseconds / 1000) % 60;
        const minutes: number = Math.floor(milliseconds / 60 / 1000 % 60);
        const hours  : number = Math.floor (milliseconds / 3600 / 1000);

        const secondString: string = UtilityNumber.pad(seconds, 2);
        const minuteString: string = UtilityNumber.pad(minutes, 2);
        const hourString: string = UtilityNumber.pad(hours, 2);

        return hourString + separator + minuteString + separator + secondString;
    }

    /**
     * Converts a {@link Date} object to an HH and MM representation of the time of day the date represents.
     * @param date - The {@link Date} object to convert.
     * @param separator - The separator to use between the HH and MM instances of the result. Defaults to {@link DEFAULT_TIME_SEPARATOR}.
     * @returns An HH MM string representation of the time of day of the input date.
     */
    public static dateToHHMM = (date: Date, separator: string = UtilityTime.DEFAULT_TIME_SEPARATOR) : string => 
    {
        const hours  : number = date.getHours();
        const minutes: number = date.getMinutes();
        
        const minuteString = UtilityNumber.pad(minutes, 2);
        const hourString = UtilityNumber.pad(hours, 2);

        return hourString + separator + minuteString;
    }

    /**
     * Converts a {@link Date} object to milliseconds since epoch.
     * @param data - The {@link Date} object to convert.
     * @param accountForTimezone - Whether or not to consider the timezone offset of the {@link Date} object when converting to milliseconds to epoch. Defaults to false.
     * @returns The milliseconds since epoch that the date represents.
     */
    public static dateToMilliseconds = (date: Date, accountForTimezone: boolean = false) : number =>
    {
        var result: number = date.getTime();

        if(accountForTimezone)
        {   result += date.getTimezoneOffset() * 60 * 1000;}

        return result;
    }

    /**
     * Converts an epoch timestamp in milliseconds to a locale time string.
     * @param milliseconds - The milliseconds since epoch to convert to a locale time string representation.
     * @returns The locale time string representation of the epoch timestamp.
     */
    public static millisecondsSinceEpochToTimeOfDay = (milliseconds: number) : string =>
    {   return new Date(milliseconds).toLocaleTimeString();}

    /**
     * This utility method converts a duration in milliseconds to a string describing the duration. As a general rule, the long
     * description will omit parts that are 0, and show only 2 granularities.
     * 
     * @example
     * 
     */
    public static millisecondsToLongDuration = (milliseconds: number) =>
    {
        const days: number = Math.floor(milliseconds / 86400000);
        milliseconds = milliseconds % 86400000;

        const hours: number = Math.floor(milliseconds / 3600000);
        milliseconds = milliseconds % 3600000;

        const minutes: number = Math.floor(milliseconds / 60000);

        if(days == 0 && hours == 0 && minutes == 0)
        {   return "less than 1 minute.";}

        var result: string;
        if(days > 0)
        {
            result = days + " " + UtilityTime.handlePlurality("day", "days", days) + " ";
            if(hours > 0)
            {   result +=  "and " + hours + " " + UtilityTime.handlePlurality("hour", "hours", hours) + " ";}
        }
        else if(hours > 0)
        {   
            result =  hours + " " + UtilityTime.handlePlurality("hour", "hours", hours) + " ";
            if(minutes > 0)
            {   result += "and " + minutes + " " + UtilityTime.handlePlurality("minute", "minutes", minutes) + ".";}  
        }
        else if(minutes > 0)
        {   result = minutes + " " + UtilityTime.handlePlurality("minute", "minutes", minutes) + ".";}
        else
        {   result = "less than 1 minute.";}

        return result;
    }

    /**
     * @returns A string representation of the {@link Date} object, based on the inserted {@link Intl.DateTimeFormatOptions}.
     * @param date - The {@link Date} object to convert to a string representation.
     * @param options - An optional {@link Intl.DateTimeFormatOptions} object to configure the transformation.
     */
    public static dateToString = (date: Date, options?: Intl.DateTimeFormatOptions) =>
    {
        if(options == undefined)
        {   options = {year: "numeric", month: "short", day: "numeric" };}

        return date.toLocaleDateString("en-US",  options);
    }

    /**
     * Determines whether to use a singular or plural form, based on an inserted quantity.
     * @param singular - The string to use for singular cases.
     * @param plural - The string to use for plural cases.
     * @param value - The numerical value to determine whether to use plural or singular form.
     * @returns The singular version if the value is 1, otherwise the plural version.
     */
    private static handlePlurality = (singular: string, plural: string, value: number): string => 
    {   return value == 1 ? singular : plural;}
}
