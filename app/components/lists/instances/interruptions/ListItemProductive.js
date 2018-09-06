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
            paddingTop: 8,
            paddingBottom: 10
        }, 
        subtitle:
        {
            color: Theme.colors.typography.subtitle
        }
    }
}

export default class ListItemProductive extends AbstractListItem
{
    constructor(props) 
    {
        super(props);
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
    {   return "Time between: " + this.getDuration();}

    getItemContent = () =>
    { 
        return (
            <View style={styles.wrapper}>
               <Icon style={styles.icon} size={30} name="location-on" color="transparent" />
               <View style={styles.text.wrapper}>
                   <Text style={styles.text.subtitle}>{this.getSubtitle()}</Text>
               </View>
            </View>
        );
    }
} 


ListItemProductive.propTypes = {
}