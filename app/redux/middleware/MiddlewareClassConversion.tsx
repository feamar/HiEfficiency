import { AnyAction, MiddlewareAPI, Dispatch } from "redux";
import { ReduxState } from "../ReduxState";
import AbstractReduxAction from "../actions/AbstractReduxAction";

export default (_store: MiddlewareAPI<Dispatch, ReduxState>)  => (next: Dispatch<AnyAction>) => (action: AnyAction) => 
{
    if(action instanceof AbstractReduxAction)
    {   
        action = action.toPlainObject();
        console.log("Middleware - if");
    }
    else
    {
        console.log("Middleware - else");

    }
    return next(action);
}
