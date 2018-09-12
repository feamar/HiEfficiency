import { NativeModules } from 'react-native'

export default class UtilityTime
{
    static millisecondsToHHMMSS(milliseconds, separator)
    {
        if(milliseconds == false)
        {   return undefined;}

        if(separator == undefined)
        {   separator = ":";}

        var seconds = Math.round(milliseconds / 1000) % 60;
        var minutes = Math.floor(milliseconds / 60 / 1000 % 60);
        var hours   = Math.floor (milliseconds / 3600 / 1000);

        var secondString = seconds < 10 ? "0" + seconds : seconds;
        var minuteString = minutes < 10 ? "0" + minutes : minutes;
        var hourString = hours < 10 ? "0" + hours : hours;

        return hourString + separator + minuteString + separator + secondString;
    }

    static dateToMilliseconds = (date, accountForTimezone) =>
    {
        var result;
        if(date == undefined)
        {   result = new date().getTime();}
        else
        {   result = date.getTime();}

        if(accountForTimezone)
        {   result += date.getTimezoneOffset() * 60 * 1000;}

        return result;
    }

    static dateToHHMM(date) 
    {
        //date.setTime(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
        var hours = date.getHours();
        var minutes = date.getMinutes();
        

        if (hours < 10) { hours = "0" + hours; }

        if (minutes < 10) { minutes = "0" + minutes; }

        return hours + ":" + minutes;
    }

    static millisecondsSinceEpochToTimeOfDay(milliseconds, separator)
    {
        if(milliseconds == false)
        {   return undefined;}

        if(separator == undefined)
        {   separator = ":";}

        var result = new Date(milliseconds).toLocaleTimeString();
        //console.log("Timestamp " + milliseconds + " converted to time of day: " + result + ".");
         
        return result; 
    }

    static millisecondsToLongDuration(milliseconds)
    {
        const days = Math.floor(milliseconds / 86400000);
        milliseconds = milliseconds % 86400000;

        const hours = Math.floor(milliseconds / 3600000);
        milliseconds = milliseconds % 3600000;

        const minutes = Math.floor(milliseconds / 60000);

        if(days == 0 && hours == 0 && minutes == 0)
        {   return "less than 1 minute.";}

        var result = "";
        if(days > 0)
        {
            result = days + " " +handlePlurality("day", "days", days) + " ";
            if(hours > 0)
            {   result +=  "and " + hours + " " + handlePlurality("hour", "hours", hours) + " ";}
        }
        else if(hours > 0)
        {   
            result =  hours + " " + handlePlurality("hour", "hours", hours) + " ";
            if(minutes > 0)
            {   result += "and " + minutes + " " + handlePlurality("minute", "minutes", minutes) + ".";}  
        }
        else if(minutes > 0)
        {   result = minutes + " " + handlePlurality("minute", "minutes", minutes) + ".";}
        else
        {   result = "less than 1 minute.";}

        return result;
    }

    static dateToString(date, options)  
    {
        if(date == undefined)
        {   return undefined;}

        if(options == undefined)
        {   
            options = {year: "numeric", month: "short", day: "numeric" };
        }

        var result = date.toLocaleDateString("en-US",  {year: "numeric", month: "short", day: "numeric" });
        //console.log("Date " + date + " converted to string representation: " + result + ".");

        return result;
    }
}

const handlePlurality = (singular, plural, value) =>
{
    if(value == 1)
    {   return singular;}
    else
    {   return plural;}
}