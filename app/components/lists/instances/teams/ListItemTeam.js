import React, {Component} from "react";
import {View} from "react-native";
import {Text, TouchableRipple} from "react-native-paper"
import { Divider } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import AbstractListItem from "../../abstractions/list/AbstractListItem";
import Theme from "../../../../styles/Theme";
import ActionType from "../../../../enums/ActionType";
import PropTypes from "prop-types";
import UtilityObject from "../../../../utilities/UtilityObject";

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
        this.addContextMenuItem("Leave", ActionType.LEAVE);
        this.addContextMenuItem("Inspect", ActionType.INSPECT);
        this.addContextMenuItem("Edit", ActionType.EDIT);

        if(__DEV__)
        {   this.addContextMenuItem("(Development) Delete", ActionType.DELETE);}
    }

    getItemContent = () => 
    {
        return <Text style={styles.teamName}>{this.state.item.data.name}</Text>
    }
}

ListItemTeam.propTypes = {
}