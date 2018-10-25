import React from "react";
import AbstractListItem, { AbstractListItemPropsVirtual } from "../../abstractions/list/AbstractListItem";
import {View} from "react-native";
import {Text} from "react-native-paper";
import Icon  from "react-native-vector-icons/MaterialIcons";
import UtilityTime from "../../../../utilities/UtilityTime";
import ModelProductive from "./models/ModelProductive";
import { Baseable, onBaseReference } from "../../../../render_props/Baseable";
import { InterruptionListStyles } from "./ListInterruptions";

type Props = AbstractListItemPropsVirtual<ModelProductive> & 
{

}

interface State
{

}


export default class ListItemProductive extends React.Component<Props, State> implements Baseable<AbstractListItem<ModelProductive>>
{
    public base: AbstractListItem<ModelProductive> | undefined;

    constructor(props: Props) 
    {
        super(props);
    }

    getDuration = (item: ModelProductive) =>
    {
        if(item.duration == undefined)
        {   return undefined;}

        return UtilityTime.millisecondsToLongDuration(item.duration);
    } 

    getSubtitle = (item: ModelProductive) =>
    {   return "Time between: " + this.getDuration(item);}

    getItemContent = (item: ModelProductive) =>
    { 
        return (
            <View style={InterruptionListStyles.wrapper}>
               <Icon style={InterruptionListStyles.icon} size={30} name="location-on" color="transparent" />
               <View style={InterruptionListStyles.text_wrapper}>
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
