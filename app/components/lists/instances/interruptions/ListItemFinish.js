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


export default class ListItemFinish extends AbstractListItem
{
    constructor(props)
    {
        super(props);

        this.addContextMenuItem("Edit", ActionType.EDIT);
    }

    onComponentWillReceiveProps = (props) =>
    {
       
    }

    getTimeOfDay = (timestamp) =>
    {   return UtilityTime.dateToHHMM(new Date(timestamp));} 

    getSubtitle = () =>
    {   return "At " + this.getTimeOfDay(this.state.item.timestamp);}

    getItemContent = () =>
    { 
        return (
            <View style={styles.wrapper}>
               <Icon style={styles.icon} size={30} name="location-on" />
               <View style={styles.text.wrapper}>
                   <Text style={styles.text.title}>Finished</Text>
                   <Text style={styles.text.subtitle}>At {this.getTimeOfDay(this.state.item.timestamp)}</Text>
               </View>
            </View>
        );
    }
} 


ListItemFinish.propTypes = {
}