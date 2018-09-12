import React, {Component} from "react";
import {View} from "react-native";
import PropTypes from "prop-types";
import Icon  from "react-native-vector-icons/MaterialIcons";
import {Text, TouchableRipple} from "react-native-paper"
import { Divider } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import UtilityObject from "../../../../utilities/UtilityObject";

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

        //console.log("Constructor props: " + UtilityObject.stringify(this.props));
        this.state = {
            item: this.props.item,
            index: this.props.index,
            actions: []
        }
    }

    componentWillReceiveProps = (props) =>
    {   
        if(this.onComponentWillReceiveProps)
        {
            this.onComponentWillReceiveProps(props);
        }

        if(props.item != undefined)
        {   this.setState({item: props.item});}

        if(props.index != undefined)
        {   this.setState({index: props.index});}
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
        if(this.componentIsMounted)
        {   this.setState({actions: actions});}
        else
        {   this.state = {...this.state, actions};}
    }

    componentWillMount = () =>
    {
        this.componentIsMounted = true;
    }

    componentWillUnmount = () =>
    {
        this.componentIsMounted = false;
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
    item: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired,
    onItemSelected: PropTypes.func,
    onContextMenuItemSelected: PropTypes.func
}
