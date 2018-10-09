/**
 * A ColorChannel stores the value of a single channel, whether that is an RGB channel, an HSV channel or an alpha channel. 
 * The constructor is private, so make use of the static factory pattern denoted by {@link fromByteValue} and {@link fromHexValue}.
 */
export default class ColorChannel
{
    /**
     * Factory method for constructing a {@link ColorChannel}.
     * @param byteValue - A numeric value between 0 and 255, indicating the value of the channel.
     * @returns A newly created {@link ColorChannel}.
     */
    static fromByteValue = (byteValue: number) : ColorChannel =>
    {   return new ColorChannel(byteValue);}

    /**
     * Factory method for constructing a {@link ColorChannel}.
     * @param hexValue - A string value representing a hexadecimal value. Should be between 00 and FF. If the string is prepended with a "#", it is stripped from the input.
     * @returns A newly created {@link ColorChannel}.
     */
    static fromHexValue = (hexValue: string) : ColorChannel =>
    {   
        console.log("From hex value: " + hexValue);
        if(hexValue.charAt(0) == "#")
        {   hexValue = hexValue.slice(1);}

        return new ColorChannel(parseInt(hexValue, 16));
    }

    byteValue: number;

    private constructor (byteValue: number)
    {
        if(byteValue < 0 || byteValue > 255)
        {   throw new Error("Color channel byte value should be between 0 and 255 (8 bit range). The current value is: " + byteValue + ".");}

        this.byteValue = byteValue;
    }

    /**
     * Get the current channel value as a hexidecimal value, between 00 and FF.
     * @param includeHash - Whether to prepend the hexadecimal value with a hash sign (#).
     * @returns A hexadecimal string representation of the current channel value, guaranteed to be between 00 and FF.
     */
    toHexadecimal = (includeHash: boolean = false) : string =>
    {
        var hex: string = this.byteValue.toString(16);
        if(hex.length == 1)
        {   hex = "0" + hex;}

        if(includeHash)
        {   hex = "#" + hex;}

        return hex;
    }

    /**
     * Gets the current channel value as a byte value, between 0 and 255.
     * @returns A number value representing the current channel value, guaranteerd to be between 0 and 255.
     */
    toByteValue = () : number =>
    {   return this.byteValue;}
}