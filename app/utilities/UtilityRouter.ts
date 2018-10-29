import { HiEfficiencyNavigator } from "../components/routing/RoutingTypes";

export default class UtilityRouter
{
    static getBaseRoute = (navigator: HiEfficiencyNavigator): HiEfficiencyNavigator =>
    {
        const parent = UtilityRouter.getParentNavigator(navigator);
        if(parent == undefined)
        {   return navigator;}
        else
        {   return UtilityRouter.getBaseRoute(parent);}
    }

    static getParentNavigator = (navigator: HiEfficiencyNavigator): HiEfficiencyNavigator | undefined =>
    {
        const parent = (navigator as any).dangerouslyGetParent();
        if(parent)
        {   return parent as HiEfficiencyNavigator;}
        else
        {   return undefined;}
    }

    static getParentByName = (navigator: HiEfficiencyNavigator, name: string): HiEfficiencyNavigator | undefined =>
    {
        if(navigator.state.routeName == name)
        {   return navigator;}

        const parent = UtilityRouter.getParentNavigator(navigator);
        if(parent == undefined)
        {   return undefined;}
        else
        {   return UtilityRouter.getParentByName(parent, name);}
    }
}