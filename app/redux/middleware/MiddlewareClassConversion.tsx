import { AnyAction, MiddlewareAPI, Dispatch } from "redux";
import { ReduxState } from "../ReduxState";
import AbstractReduxAction from "../actions/AbstractReduxAction";

export default (_store: MiddlewareAPI<Dispatch, ReduxState>)  => (next: Dispatch<AnyAction>) => (action: AnyAction) => 
{
    console.log("Redux Reducer - " + action.constructor.name);    
    
    if(action instanceof AbstractReduxAction)
    {   action = action.toPlainObject();}
    
    return next(action);
}
