import React, {Component} from "react";
import {View} from "react-native";
import {Text, TouchableRipple} from "react-native-paper"
import { Divider } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import AbstractListItem from "../AbstractListItem";
import Theme from "../../../styles/Theme";


export const ACTION_LEAVE_TEAM = "leave";
export const ACTION_RENAME_TEAM = "rename";
export const ACTION_INSPECT_TEAM = "inspect";
export const ACTION_DELETE_TEAM = "delete";

const styles = {
    teamName: {
        paddingLeft: 20,
        fontWeight: "bold",
        color: Theme.colors.typography.title
    }
}
 
export default class ListItemTeam extends AbstractListItem
{
    constructor(props)
    {
        super(props);
        this.addContextMenuItem("Leave", ACTION_LEAVE_TEAM);
        this.addContextMenuItem("Rename", ACTION_RENAME_TEAM);
        this.addContextMenuItem("Inspect", ACTION_INSPECT_TEAM);
        //this.addContextMenuItem("Delete", ACTION_DELETE_TEAM);
    }

    componentWillReceiveProps = (props) => 
    {   this.setState({item: props.item, index: props.index});}

    getItemContent = () => 
    {
        return <Text style={styles.teamName}>{this.state.item.data().name}</Text>
    }
}