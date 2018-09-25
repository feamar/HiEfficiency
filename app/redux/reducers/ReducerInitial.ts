import { combineReducers } from 'redux'
import ReducerUser from "./ReducerUser";
import ReducerInspecting from './ReducerInspecting';

export default combineReducers({
    user: ReducerUser,
    inspecting: ReducerInspecting
});