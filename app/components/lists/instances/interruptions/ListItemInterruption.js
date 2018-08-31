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

        if(this.state.item.deletable && false) //Remove && false when deletion is properly handled not to leave orphan documents.
        {   this.addContextMenuItem("Delete", ACTION_DELETE_INTERRUPTION);}
    }

    onComponentWillReceiveProps = (props) =>
    {
        if(this.props.item.editable == false && props.item.editable == true)
        {   this.addContextMenuItem("Edit", ACTION_EDIT_INTERRUPTION);}

        if(this.props.item.deletable == false && props.item.deletable == true && false) //Remove && false when deletion is properly handled not to leave orphan documents.
        {   this.addContextMenuItem("Delete", ACTION_DELETE_INTERRUPTION);}
    }

    getDuration = () =>
    {
        if(this.state.item.duration == undefined)
        {   return undefined;}

        return UtilityTime.millisecondsToHHMMSS(this.state.item.duration, ":");
    } 

    getDurationString = () =>
    {
        if(this.state.item.duration == undefined)
        {   return null;}

        return " for " + this.getDuration();
    }

    getTimeOfDay = (timestamp) =>
    {  
        return asTime(new Date(timestamp));
    } 

    getItemContent = () =>
    { 
        //const data = this.state.item.data();
        return (
            <View style={styles.wrapper}>
               <Icon style={styles.icon} size={30} name={this.state.item.iconName}/>
               <View style={styles.text.wrapper}>
                   <Text style={styles.text.title}>{this.state.item.title}</Text>
                   <Text style={styles.text.subtitle}>At {this.getTimeOfDay(this.state.item.timestamp)}{this.getDurationString()}</Text>
               </View>
            </View>
        );
    }
} 


ListItemInterruption.propTypes = {
}