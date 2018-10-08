import { NavigationRoute, NavigationScreenProp } from "react-navigation";


//Dn't make it extend NavigationScreenProps
export interface CustomScreenProps
{

}


export interface CustomNavigationState
{
    routes: Array<NavigationRoute>
}
  
//Don't make it extend NavigationParam, because that simply makes it indexable on string keys (i.e. allows any, and escapes from the type system.)
export interface CustomNavigationParams
{
  header_right_injection?: () => JSX.Element | undefined,
  initial_route_name?: string,
  title: string,
  subtitle?: string,
  onBackClicked?: () => boolean
}

export type HiEfficiencyNavigator = NavigationScreenProp<NavigationRoute<CustomNavigationParams>, CustomNavigationParams>