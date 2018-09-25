import { combineReducers } from 'redux'
import ReducerUser from "./ReducerUser";
import ReducerInspecting from './ReducerInspecting';
import ReduxUser from '../../dtos/redux/ReduxUser';
import ReduxInspecting from '../../dtos/redux/ReduxInspecting';
import AbstractReduxAction from '../actions/AbstractReduxAction';

export type State =
{
    user?: ReduxUser;
    inspecting: ReduxInspecting;
}

export type Action = AbstractReduxAction;

export default combineReducers<State, Action>({
    user: ReducerUser,
    inspecting: ReducerInspecting
});
