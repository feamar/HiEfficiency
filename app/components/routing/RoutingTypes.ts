import { NavigationRoute } from "react-navigation";

export interface CustomNavigationState
{
    routes: Array<NavigationRoute>
}
  
export interface CustomNavigationParams
{
  header_right_injection?: () => JSX.Element,
  initial_route_name?: string,
  title: string,
  subtitle?: string
}
