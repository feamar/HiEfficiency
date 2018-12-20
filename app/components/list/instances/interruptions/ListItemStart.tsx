import React, { Component } from "react";
import AbstractListItem, { AbstractListItem_Props_Virtual } from "../../abstractions/list/AbstractListItem";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ActionOption from "../../../../dtos/options/ActionOption";
import ActionType from "../../../../enums/ActionType";
import UtilityTime from "../../../../utilities/UtilityTime";
import { View } from "react-native";
import {Text} from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { InterruptionListStyles } from "./ListInterruptions";
import ModelStart from "./models/ModelStart";

type Props = AbstractListItem_Props_Virtual<ModelStart> & 
{

}

interface State
{
    item: ModelStart,
    index: number
}

export default class ListItemStart extends Component<Props, State> implements Baseable<AbstractListItem<ModelStart>>
{
    public base: AbstractListItem<ModelStart> | undefined;

    constructor(props: Props, _?: any)
    {
        super(props);

        this.state = {
            item: props.item,
            index: props.index
        }
    }


    onBaseReference = async (reference?: AbstractListItem<ModelStart>) =>
    {
        if(reference)
        {   await reference.addContextMenuItem(new ActionOption(ActionType.EDIT, "Edit"));}
    }

    getTimeOfDay = (timestamp: Date) =>
    {   return UtilityTime.dateToHHMM(timestamp);} 

    getSubtitle = (item: ModelStart) =>
    {   return "At " + this.getTimeOfDay(item.startedOn);}

    getItemContent = (item: ModelStart) =>
    { 
        return (
            <View style={InterruptionListStyles.wrapper}>
               <Icon style={InterruptionListStyles.icon} size={30} name="location-on" />
               <View style={InterruptionListStyles.text_wrapper}>
                   <Text style={InterruptionListStyles.text_title}>Started</Text>
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