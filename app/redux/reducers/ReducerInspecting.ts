import update from 'immutability-helper';
import ReduxInspecting from "../../dtos/redux/ReduxInspecting";
import ActionStartInspectTeam from '../actions/inspection/ActionStartInspectTeam';
import ActionStartInspectStory from '../actions/inspection/ActionStartInspectStory';
import UtilityRedux from '../../utilities/UtilityRedux';
import { AnyAction } from 'redux';

export default (inspecting: ReduxInspecting | undefined, action: AnyAction) =>
{
    if(inspecting == undefined)
    {   return new ReduxInspecting();}

    if(UtilityRedux.actionIs<ActionStartInspectTeam>(action, ActionStartInspectTeam.TYPE))
    {   return update(inspecting, {team: {$set: action.teamId}});}

    if(UtilityRedux.actionIs<ActionStartInspectStory>(action, ActionStartInspectStory.TYPE))
    {   return update(inspecting, {story: {$set: action.storyId}});}

    return inspecting;
};