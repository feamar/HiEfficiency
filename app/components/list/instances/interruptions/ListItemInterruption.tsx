import React, { Component } from "react";
import AbstractListItem, { AbstractListItemPropsVirtual } from "../../abstractions/list/AbstractListItem";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ActionOption from "../../../../dtos/options/ActionOption";
import ActionType from "../../../../enums/ActionType";
import { View } from "react-native";
import { Text} from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModelInterruption from "./models/ModelInterruption";
import { InterruptionListStyles } from "./ListInterruptions";
import UtilityTime from "../../../../utilities/UtilityTime";

type Props = AbstractListItemPropsVirtual<ModelInterruption> & 
{

}

interface State
{
    item: ModelInterruption,
    index: number
}

export default class ListItemInterruption extends Component<Props, State> implements Baseable<AbstractListItem<ModelInterruption>>
{
    public base: AbstractListItem<ModelInterruption> | undefined;

    constructor(props: Props, _?: any)
    {
        super(props);

        this.state = {
            item: props.item,
            index: props.index
        }
    }

    onBaseReference = async (reference?: AbstractListItem<ModelInterruption>) =>
    {
        if(reference)
        {  
            await reference.addContextMenuItem(new ActionOption(ActionType.EDIT, "Edit"));
            await reference.addContextMenuItem(new ActionOption(ActionType.DELETE, "Delete"));
        }
    }

    componentWillReceiveProps = (props: Props) =>
    {
        if(this.state.item.duration == undefined && props.item.duration != undefined)
        {   this.setState({item: props.item});}
    }

    isInProgress = (item: ModelInterruption) =>
    {   return item.duration == undefined}

    getDuration = (item: ModelInterruption) =>
    {
        if(item.duration == undefined)
        {   return undefined;}

        return UtilityTime.millisecondsToLongDuration(item.duration);
    } 

    getTimeOfDay = (timestamp: Date) =>
    {   return UtilityTime.dateToHHMM(timestamp);} 

    getSubtitle = (item: ModelInterruption) =>
    {
        if(this.isInProgress(item))
        {   return "At " + this.getTimeOfDay(item.timestamp);}
        else
        {   
            const durationString = this.getDuration(item);
            return "At " + this.getTimeOfDay(item.timestamp) + " for " + durationString;
        }
    }

    getItemContent = (item: ModelInterruption) =>
    { 
        return (
            <View style={InterruptionListStyles.wrapper}>
               <Icon style={InterruptionListStyles.icon} size={30} name={item.iconName} color={item.iconColor.toHexadecimal()} />
               <View style={InterruptionListStyles.text_wrapper}>
                   <Text style={InterruptionListStyles.text_title}>{item.title}</Text>
                   <Text style={InterruptionListStyles.text_subtitle}>{this.getSubtitle(item)}</Text>
               </View>
            </View>
        );
    }

    render()
    {
        return (
            <AbstractListItem ref={onBaseReference(this)} content={this.getItemContent} {...this.props} />            
        );
    }
}