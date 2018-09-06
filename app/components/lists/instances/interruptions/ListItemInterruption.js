import React from "react";
import AbstractListItem from "../../abstractions/list/AbstractListItem";
import PropTypes from "prop-types";
import {View} from "react-native";
import {Text} from "react-native-paper";
import Icon  from "react-native-vector-icons/MaterialIcons";
import Theme from "../../../../styles/Theme";
import {asTime, difference} from "../../../util/DateUtil";
import UtilityTime from "../../../../utilities/UtilityTime";

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 20
    },
    icon:{
        paddingRight: 20 
    },
    text:
    {
        wrapper:{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: 16,
            paddingBottom: 16
        }, 
        title:
        {
            fontWeight: "bold",
            color: Theme.colors.typography.title
        },
        subtitle:
        {
            color: Theme.colors.typography.subtitle
        }
    }
}

export const ACTION_EDIT_INTERRUPTION = "edit";
export const ACTION_DELETE_INTERRUPTION = "delete";

export default class ListItemInterruption extends AbstractListItem
{
    constructor(props)
    {
        super(props);

        if(this.state.item.editable)
        {   this.addContextMenuItem("Edit", ACTION_EDIT_INTERRUPTION);}

        if(this.state.item.deletable) 
        {   this.addContextMenuItem("Delete", ACTION_DELETE_INTERRUPTION);}
    }

    onComponentWillReceiveProps = (props) =>
    {
        if(this.props.item.editable == false && props.item.editable == true)
        {   this.addContextMenuItem("Edit", ACTION_EDIT_INTERRUPTION);}

        if(this.props.item.deletable == false && props.item.deletable == true) 
        {   this.addContextMenuItem("Delete", ACTION_DELETE_INTERRUPTION);}
    }

    getDuration = () =>
    {
        if(this.state.item.duration == undefined)
        {   return undefined;}

        //return UtilityTime.millisecondsToHHMMSS(this.state.item.duration, ":");
        return UtilityTime.millisecondsToLongDuration(this.state.item.duration);
    } 

    getTimeOfDay = (timestamp) =>
    {  
        return asTime(new Date(timestamp));
    } 

    getSubtitle = () =>
    {
        const durationString = this.getDuration();

        if(this.isProductiveItem())
        {   return "Time between: " + durationString;}
        else if(durationString && !this.isStartItem() && ! this.isFinishItem())
        {   return "At " + this.getTimeOfDay(this.state.item.timestamp) + " for " + durationString;}
        else
        {   return "At " + this.getTimeOfDay(this.state.item.timestamp);}
    }

    isStartItem = () => 
    {   return this.state.item.title == "Started";}

    isFinishItem = () =>
    {   return this.state.item.title == "Finished";}

    isProductiveItem = () =>
    {   return this.state.item.iconColor == "transparent";}

    getTextWrapperStyles = () =>
    {
        if(this.isProductiveItem() == false)
        {   return styles.text.wrapper;}

        var overridden = JSON.parse(JSON.stringify(styles.text.wrapper));
        overridden.paddingTop = 6;
        overridden.paddingBottom = 10;

        return overridden;
    }

    getItemContent = () =>
    { 
        //const data = this.state.item.data();
        return (
            <View style={styles.wrapper}>
               <Icon style={styles.icon} size={30} name={this.state.item.iconName} color={this.state.item.iconColor} />
               <View style={this.getTextWrapperStyles()}>
                   <Text style={styles.text.title}>{this.state.item.title}</Text>
                   <Text style={styles.text.subtitle}>{this.getSubtitle()}</Text>
               </View>
            </View>
        );
    }
} 


ListItemInterruption.propTypes = {
}