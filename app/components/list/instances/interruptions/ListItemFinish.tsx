import React, { Component } from "react";
import AbstractListItem, { AbstractListItemPropsVirtual } from "../../abstractions/list/AbstractListItem";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import ActionOption from "../../../../dtos/options/ActionOption";
import ActionType from "../../../../enums/ActionType";
import UtilityTime from "../../../../utilities/UtilityTime";
import { View } from "react-native";
import {Text} from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModelFinish from "./models/ModelFinish";
import { InterruptionListStyles } from "./ListInterruptions";

type Props = AbstractListItemPropsVirtual<ModelFinish> & 
{

}

interface State
{
    item: ModelFinish,
    index: number
}

export default class ListItemFinish extends Component<Props, State> implements Baseable<AbstractListItem<ModelFinish>>
{
    public base: AbstractListItem<ModelFinish> | undefined;

    constructor(props: Props, _?: any)
    {
        super(props);

        this.state = {
            item: props.item,
            index: props.index
        }
    }

    onBaseReference = async (reference?: AbstractListItem<ModelFinish>) =>
    {
        if(reference )
        {   await reference.addContextMenuItem(new ActionOption(ActionType.EDIT, "Edit"));}
    }

    getTimeOfDay = (timestamp: Date) =>
    {   return UtilityTime.dateToHHMM(timestamp);} 

    getSubtitle = (item: ModelFinish) =>
    {   
        return "At " + this.getTimeOfDay(item.finishedOn);
    }

    getItemContent = (item: ModelFinish) =>
    { 
        return (
            <View style={InterruptionListStyles.wrapper}>
               <Icon style={InterruptionListStyles.icon} size={30} name="location-on" />
               <View style={InterruptionListStyles.text_wrapper}>
                   <Text style={InterruptionListStyles.text_title}>Finished</Text>
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