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
        {   options = {year: 'numeric', month: 'numeric', day: 'numeric' };}

        var result = date.toLocaleDateString(undefined, options);
        console.log("Date " + date + " converted to string representation: " + result + ".");

        return result;
    }
}