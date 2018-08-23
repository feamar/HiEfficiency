import React, {Component} from "react";
import {View} from "react-native";
import PropTypes from "prop-types";
import Icon  from "react-native-vector-icons/MaterialIcons";
import {Text, TouchableRipple} from "react-native-paper"
import { Divider } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";

const styles = {
    listItem:{ 
        flexDirection: "row",
    },
    contentWrapper: {
        flex: 1,
        justifyContent: "center"
    },
    menuOptions:{
        optionWrapper:{
            padding:15,
        }
    }, 
    menuTrigger:{ 
        triggerWrapper:  
        {
            padding:20 
        }
    }
}
 
export default class AbstractListItem extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            item: this.props.item,
            index: this.props.index,
            actions: []
        }

        
    }

    onListItemSelected = () => () =>
    {
        if(this.props.onItemSelected)
        {   this.props.onItemSelected(this.state.item, this.state.index);}
    }

    onContextMenuPressed = () =>
    {
        if(this.state.menu)
        {   this.state.menu.openMenu();}
    }

    onContextMenuItemSelected = (action) => () =>
    {
        if(this.props.onContextMenuItemSelected)
        {   this.props.onContextMenuItemSelected(this.state.item, this.state.index, action);}
    }

    addContextMenuItem = (text, name) =>
    {
        var actions = this.state.actions;
        actions.push({text: text, name: name});
        this.state = {...this.state, actions};
    }

    hasContextMenuItems = () => 
    {   return this.state.actions.length > 0;}

    render()
    {
        return (
            <View>
                <TouchableRipple onPress={this.onListItemSelected()}>
                    <View style={styles.listItem}>
                        <View style={styles.contentWrapper}>
                            {this.getItemContent()}
                        </View>
                        {this.hasContextMenuItems() && 
                            <Menu ref={instance => this.state.menu = instance}>
                                <MenuTrigger customStyles={styles.menuTrigger}> 
                                    <Icon style={styles.icon} size={30} name="more-vert" />
                                </MenuTrigger>
                                <MenuOptions customStyles={styles.menuOptions}>
                                    {this.state.actions.map(action => {
                                        return <MenuOption key={action.name} text={action.text} onSelect={this.onContextMenuItemSelected(action.name)} />
                                    })}
                                </MenuOptions>
                            </Menu>
                        }
                        
                    </View>
                </TouchableRipple>
                <Divider /> 
            </View>
        );
    }
}

AbstractListItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onItemSelected: PropTypes.func,
    onContextMenuItemSelected: PropTypes.func
}
