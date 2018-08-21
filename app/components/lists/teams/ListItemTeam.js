import React, {Component} from "react";
import {View} from "react-native";
import PropTypes from "prop-types";
import Icon  from "react-native-vector-icons/MaterialIcons";
import {Text, TouchableRipple} from "react-native-paper"
import { Divider } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";


export const ACTION_LEAVE = "leave";
export const ACTION_RENAME = "rename";
export const ACTION_INSPECT = "inspect";

const styles = {
    listItem:{ 
        padding:20,
        flexDirection: "row",
    },
    contentWrapper: {
        flex: 1,
        justifyContent: "center"
    },
    teamName: {
        fontWeight: "bold",
        color: "#434343"
    },  
    icon: { 

    },
    menuOptions:{
        optionWrapper:{
            padding:15,
        }
    }
}
 
export default class ListItemTeam extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            team: this.props.team,
            index: this.props.index
        }
    }

    onListItemSelected =() => () =>
    {
        if(this.props.onItemSelected)
        {   this.props.onItemSelected(this.state.team, this.state.index);}
    }

    onContextMenuPressed = () =>
    {
        if(this.state.menu)
        {   this.state.menu.openMenu();}
    }

    onContextMenuItemSelected = (action) => () =>
    {
        if(this.props.onContextMenuItemSelected)
        {   this.props.onContextMenuItemSelected(this.state.team, this.state.index, action);}
    }

    render()
    {
        return (
            <View>
                <TouchableRipple onPress={this.onListItemSelected()}>
                    <View style={styles.listItem}>
                        <View style={styles.contentWrapper}>
                            <Text style={styles.teamName}>{this.state.team.name}</Text>
                        </View>
                        <Menu ref={instance => this.state.menu = instance}>
                            <MenuTrigger> 
                                <Icon style={styles.icon} size={30} name="more-vert" />
                            </MenuTrigger>
                            <MenuOptions customStyles={styles.menuOptions}>
                                <MenuOption text="Leave" onSelect={this.onContextMenuItemSelected(ACTION_LEAVE)}></MenuOption>
                                <MenuOption text="Rename" onSelect={this.onContextMenuItemSelected(ACTION_RENAME)}></MenuOption>
                                <MenuOption text="Inspect" onSelect={this.onContextMenuItemSelected(ACTION_INSPECT)}></MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                </TouchableRipple>
                <Divider /> 
            </View>
        );
    }
}

ListItemTeam.propTypes = {
    team: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onItemSelected: PropTypes.func.isRequired,
    onContextMenuItemSelected: PropTypes.func.isRequired
}
