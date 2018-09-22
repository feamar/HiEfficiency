export default class UtilityColor
{
    static rgbToHex = (r, g, b) =>
    {   return "#" + UtilityColor.channelToHexadecimal(r) + UtilityColor.channelToHexadecimal(g) + UtilityColor.channelToHexadecimal(b);}

    static channelToHexadecimal = (channel) =>
    {
        var hex = channel.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    //See https://stackoverflow.com/a/5624139/4119127
    static hexToRgb = (hex) =>
    {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        
        //^         - Match beginning of string.
        //#?        - Match zero or one hash/pound signs.
        //([a-f\d]) - Matches any character from a to f (a-f), or a digit (\d).
        //$         - Match end of string.
        //i         - Ignore case flag.
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) 
        {   return r + r + g + g + b + b;});

        //^         - Match beginning of string.
        //#?        - Match zero or one hash/pound signs.
        //([a-f\d]) - Matches any character from a to f (a-f), or a digit (\d).
        //{2}       - Match the previous group, denoted by ( and ), exactly 2 times.
        //$         - Match end of string.
        //i         - Ignore case flag.
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if(result == undefined)
        {   return undefined;}

        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    }

    static rgbToCss = (rgb, alpha) =>
    {
        if(alpha == undefined)
        {   alpha = 1;}

        return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
    }
}