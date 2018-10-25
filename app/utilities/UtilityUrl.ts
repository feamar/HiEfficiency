import { Linking } from "react-native";

export default class UtilityUrl
{
    static goToUrl = async (url: string): Promise<boolean> =>
    {
        const supported = await Linking.canOpenURL(url);
        if (supported) 
        {   Linking.openURL(url);}
        
        return supported
    }
}