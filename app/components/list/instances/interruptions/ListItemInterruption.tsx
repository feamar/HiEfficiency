import React, { Component } from "react";
import AbstractListItem, { AbstractListItemPropsVirtual } from "../../abstractions/list/AbstractListItem";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ActionOption from "../../../../dtos/options/ActionOption";
import ActionType from "../../../../enums/ActionType";
import { View } from "react-native";
import {Icon, Text} from "react-native-paper";
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

export default class ListItemFinish extends Component<Props, State> implements Baseable<AbstractListItem<ModelInterruption>>
{
    private mBase?: AbstractListItem<ModelInterruption>;

    constructor(props: Props, _?: any)
    {
        super(props);

        this.state = {
            item: props.item,
            index: props.index
        }
    }

    public get base ()
    {   return this.mBase;}

    onBaseReference = (reference?: AbstractListItem<ModelInterruption>) =>
    {
        if(reference)
        {   reference.addContextMenuItem(new ActionOption(ActionType.EDIT, "Edit"));}
    }


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
        const durationString = this.getDuration(item);
        if(durationString)
        {   return "At " + this.getTimeOfDay(item.timestamp) + " for " + durationString;}
        else
        {   return "At " + this.getTimeOfDay(item.timestamp);}
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