import { combineReducers } from 'redux'
import ReducerUser from "./ReducerUser";
import ReducerInspecting from './ReducerInspecting';
import AbstractReduxAction from '../actions/AbstractReduxAction';
import { ReduxState } from '../ReduxState';


export default combineReducers<ReduxState, AbstractReduxAction>({
    user: ReducerUser,
    inspecting: ReducerInspecting
});
