import { NavigationRoute, NavigationScreenProp } from "react-navigation";
import DocumentTeam from "../../dtos/firebase/firestore/documents/DocumentTeam";
import AbstractFirestoreDocument from "../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";
import ReduxStory from "../../dtos/redux/ReduxStory";


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
  team: AbstractFirestoreDocument<DocumentTeam>,
  story: ReduxStory,
  storyId: string, 
  onBackClicked?: () => boolean
}

export type HiEfficiencyNavigator = NavigationScreenProp<NavigationRoute<CustomNavigationParams>, CustomNavigationParams>