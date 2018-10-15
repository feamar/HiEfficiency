import update from 'immutability-helper';
import ReduxInspecting from "../../dtos/redux/ReduxInspecting";
import ActionStartInspectTeam from '../actions/inspection/ActionStartInspectTeam';
import ActionStopInspectTeam from '../actions/inspection/ActionStopInspectTeam';
import ActionStartInspectStory from '../actions/inspection/ActionStartInspectStory';
import ActionStopInspectStory from '../actions/inspection/ActionStopInspectStory';
import UtilityRedux from '../../utilities/UtilityRedux';
import { AnyAction } from 'redux';

export default (inspecting: ReduxInspecting | undefined, action: AnyAction) =>
{
    if(inspecting == undefined)
    {   return new ReduxInspecting();}

    if(UtilityRedux.actionIs<ActionStartInspectTeam>(action, ActionStartInspectTeam.TYPE))
    {   return update(inspecting, {team: {$set: action.teamId}});}

    if(UtilityRedux.actionIs<ActionStopInspectTeam>(action, ActionStopInspectTeam.TYPE))
    {   return update(inspecting, {team: {$set: undefined}});}

    if(UtilityRedux.actionIs<ActionStartInspectStory>(action, ActionStartInspectStory.TYPE))
    {   return update(inspecting, {story: {$set: action.storyId}});}

    if(UtilityRedux.actionIs<ActionStopInspectStory>(action, ActionStopInspectStory.TYPE))
    {   return update(inspecting, {story: {$set: undefined}});}

    return inspecting;
};