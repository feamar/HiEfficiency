import React from "react";
import AbstractListItem from "../../abstractions/list/AbstractListItem";
import PropTypes from "prop-types";
import {View} from "react-native";
import {Text} from "react-native-paper";
import Icon  from "react-native-vector-icons/MaterialIcons";
import Theme from "../../../../styles/Theme";
import {asTime, difference} from "../../../util/DateUtil";
import UtilityTime from "../../../../utilities/UtilityTime";
import ActionType from "../../../../enums/ActionType";

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

export default class ListItemInterruption extends AbstractListItem
{
    constructor(props)
    {
        super(props);

        if(this.state.item.duration != undefined)
        {
            this.addContextMenuItem("Edit", ActionType.EDIT);
            this.addContextMenuItem("Delete", ActionType.DELETE);
        }
    }

    onComponentWillReceiveProps = (props) =>
    {
        //console.log("Current duration: " + this.props.duration + " AND next duration: " + props.duration);
        if(this.props.item.duration == undefined && props.item.duration != undefined)
        {
            this.addContextMenuItem("Edit", ActionType.EDIT);
            this.addContextMenuItem("Delete", ActionType.DELETE);
        }
    }

    getDuration = () =>
    {
        if(this.state.item.duration == undefined)
        {   return undefined;}

        return UtilityTime.millisecondsToLongDuration(this.state.item.duration);
    } 

    getTimeOfDay = (timestamp) =>
    {   return UtilityTime.dateToHHMM(new Date(timestamp));} 

    getSubtitle = () =>
    {
        const durationString = this.getDuration();
        if(durationString)
        {   return "At " + this.getTimeOfDay(this.state.item.timestamp) + " for " + durationString;}
        else
        {   return "At " + this.getTimeOfDay(this.state.item.timestamp);}
    }

    getItemContent = () =>
    { 
        return (
            <View style={styles.wrapper}>
               <Icon style={styles.icon} size={30} name={this.state.item.iconName} color={this.state.item.iconColor} />
               <View style={styles.text.wrapper}>
                   <Text style={styles.text.title}>{this.state.item.title}</Text>
                   <Text style={styles.text.subtitle}>{this.getSubtitle()}</Text>
               </View>
            </View>
        );
    }
} 


ListItemInterruption.propTypes = {
}