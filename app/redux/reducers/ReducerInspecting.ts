import update from 'immutability-helper';
import ReduxInspecting from "../../dtos/redux/ReduxInspecting";
import AbstractReduxAction from "../actions/AbstractReduxAction";
import ActionStartInspectTeam from '../actions/inspection/ActionStartInspectTeam';
import ActionStopInspectTeam from '../actions/inspection/ActionStopInspectTeam';
import ActionStartInspectStory from '../actions/inspection/ActionStartInspectStory';
import ActionStopInspectStory from '../actions/inspection/ActionStopInspectStory';

export default (inspecting: ReduxInspecting | undefined, action: AbstractReduxAction) : ReduxInspecting => 
{
    if(inspecting == undefined)
    {   return new ReduxInspecting();}

    if(action instanceof ActionStartInspectTeam)
    {   return update(inspecting, {team: {$set: action.teamId}});}

    if(action instanceof ActionStopInspectTeam)
    {   return update(inspecting, {team: {$set: undefined}});}

    if(action instanceof ActionStartInspectStory)
    {   return update(inspecting, {story: {$set: action.storyId}});}

    if(action instanceof ActionStopInspectStory)
    {   return update(inspecting, {story: {$set: undefined}});}

    return inspecting;
};