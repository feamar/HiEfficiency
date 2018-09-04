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

    static dateToHHMM(date) 
    {
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
        console.log("Timestamp " + milliseconds + " converted to time of day: " + result + ".");
         
        return result; 
    }

    static dateToString(date, options)  
    {
        if(date == false)
        {   return undefined;}

        if(options == undefined)
        {   
            options = {year: "numeric", month: "short", day: "numeric" };
        }

        var result = date.toLocaleDateString("en-US",  {year: "numeric", month: "short", day: "numeric" });
        console.log("Date " + date + " converted to string representation: " + result + ".");

        return result;
    }
}