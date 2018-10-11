import ColorChannel from "./ColorChannel";
import UtilityObject from "../../utilities/UtilityObject";

/**
 * A {@link Color} object stores the value of a four seperate {@link ColorChannel}s, representing a RGB(A) color model. The HSV(A) color model is currently not supported.
 * The constructor is private, so make use of the static factory pattern denoted by {@link fromName}, {@link fromBytes} and {@link fromHexadecimal}.
 */
export default class Color
{
     /**
     * Factory method for constructing a {@link Color} based on a CSS color name.
     * @param name - The CSS name of the color.
     * @returns A newly created {@link Color}, or undefined if the name is not valid.
     */
    static fromName = (name: string) : Color | undefined =>
    {
        var colors: {[name: string] : string} = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887", "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};
        return Color.fromHexadecimal(colors[name]);
    }

    /**
     * Factory method for constructing a {@link Color} from individual byte values for each channel.
     * @param red - The byte value for the red channel, has to be between 0 and 255.
     * @param green - The byte value for the green channel, has to be between 0 and 255.
     * @param blue - The byte value for the blue channel, has to be between 0 and 255.
     * @param alpha - The byte value for the alpha channel, has to be between 0 and 255, but defaults to 255.
     * @returns A newly created {@link Color}.
     * @throws If any of the byte values are outside the valid range of 0 up to and including 255.
     */
    static fromBytes = (red: number, green: number, blue: number, alpha: number = 255) : Color =>
    {   return new Color(ColorChannel.fromByteValue(red), ColorChannel.fromByteValue(green), ColorChannel.fromByteValue(blue), ColorChannel.fromByteValue(alpha));}

    /**
     * Factory method for constructing a {@link Color} from individual {@link ColorChannel}s.
     * @param red - The {@link ColorChannel} representing the red channel.
     * @param green - The {@link ColorChannel} representing the green channel.
     * @param blue - The {@link ColorChannel} representing the blue channel.
     * @param alpha - The {@link ColorChannel} representing the alpha channel, but defaults to a full channel.
     * @returns A newly created {@link Color}.
     */
    static fromChannels = (red: ColorChannel, green: ColorChannel, blue: ColorChannel, alpha: ColorChannel = ColorChannel.fromByteValue(255)) : Color =>
    {   return new Color(red, green, blue, alpha);}

    /**
     * Factory method for constructing a {@link Color} from a string representation of a hexadecimal color code. 
     * Supports shorthand notations ("03F"), full-form ("0033FF"), and both versions support an optional alpha channel ("03FF") or ("0033FFFF").
     * @param hex - A hexadecimal string representing a shorthand color code with an optional alpha channel ("03F" or "03FF"),
     *              or a full-form color code with an optional alpha channel ("0033FF" or "0033FFFF"). Prepended has symbols (#) are ignored.
     * @returns A newly created {@link Color}.
     */
    static fromHexadecimal = (hex: string) : Color =>
    {
        //^         - Match beginning of string.
        //#?        - Match zero or one hash/pound signs.
        //([a-f\d]) - Matches any character from a to f (a-f), or a digit (\d).
        //$         - Match end of string.
        //i         - Ignore case flag.
        const shorthandRegex: RegExp = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
        
        // Expand possible shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        hex = hex.replace(shorthandRegex, function(_, r, g, b, a) 
        {   return r + r + g + g + b + b + a + a;});

        //^         - Match beginning of string.
        //#?        - Match zero or one hash/pound signs.
        //([a-f\d]) - Matches any character from a to f (a-f), or a digit (\d).
        //{2}       - Match the previous group, denoted by ( and ), exactly 2 times.
        //$         - Match end of string.
        //i         - Ignore case flag.
        const result: RegExpExecArray | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
        if(result == null)
        {   throw new Error("Please make sure the input string '" + hex + "' is in a proper hexadecimal format.");}

        console.log("HEX COLOR: " + UtilityObject.stringify(result));

        return new Color(ColorChannel.fromHexValue(result[1]), ColorChannel.fromHexValue(result[2]), ColorChannel.fromHexValue(result[3]), ColorChannel.fromHexValue(result[4] || "FF"));
    }

    private red: ColorChannel;
    private green: ColorChannel;
    private blue: ColorChannel;
    private alpha: ColorChannel;

    private constructor(red: ColorChannel, green: ColorChannel, blue: ColorChannel, alpha: ColorChannel)
    {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    /**
     * @returns The red {@link ColorChannel} for this {@link Color} object.
     */
    getChannelRed = () : ColorChannel =>
    {   return this.red;}
    
    /**
     * @returns The green {@link ColorChannel} for this {@link Color} object.
     */
    getChannelGreen = () : ColorChannel =>
    {   return this.green;}
    
    /**
     * @returns The blue {@link ColorChannel} for this {@link Color} object.
     */
    getChannelBlue = () : ColorChannel =>
    {   return this.blue;}
    
    /**
     * @returns The alpha {@link ColorChannel} for this {@link Color} object.
     */
    getChannelAlpha = () : ColorChannel =>
    {   return this.alpha;}

    /**
     * @returns A hexadecimal string representation of the {@link Color} object's current {@link ColorChannel} values.
     * @param includeHash - Whether or not to prepend the hexadecimal string with a hash sign (#). Defaults to true.
     * @param includeAlpha - Whether or not to include the alpha channel in the hexadecimal string. Defaults to true.
     */
    toHexadecimal = (includeHash: boolean = true, includeAlpha: boolean = true) : string =>
    {
        var result = includeHash ? "#" : "";
        result += this.red.toHexadecimal() + this.green.toHexadecimal() + this.blue.toHexadecimal();
        if(includeAlpha)
        {   result += this.alpha.toHexadecimal();}

        return result;
    }

    /**
     * @returns A CSS string representation of the {@link Color} object's current {@link ColorChannel} values.
     * @param includeAlpha - Whether or not to include the alpha channel in the CSS string representation. Defaults to true.
     */
    toCss = (includeAlpha: boolean = true) : string =>
    {   
        var css = "rgb";
        
        if(includeAlpha)
        {   css += "a";}

        css += "(" + this.red.toByteValue() + ", " + this.green.toByteValue() + ", " + this.blue.toByteValue();

        if(includeAlpha)
        {   css += ", " + (this.alpha.toByteValue() / 255);}

        css += ")";
        return css;
    }
}