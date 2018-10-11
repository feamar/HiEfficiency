import { AnyAction } from "redux";

export default class UtilityRedux
{
    static actionIs = <T extends AnyAction> (obj: AnyAction, type: string) : obj is T =>
    {   return obj.type == type;}
    
}