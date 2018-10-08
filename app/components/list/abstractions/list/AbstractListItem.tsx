import React, {Component} from "react";
import {View, StyleSheet} from "react-native";
import Icon  from "react-native-vector-icons/MaterialIcons";
import {TouchableRipple} from "react-native-paper"
import { Divider } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import ActionOption from "../../../../dtos/options/ActionOption";

const styles = StyleSheet.create({
    listItem:{ 
        flexDirection: "row",
    },
    contentWrapper: {
        flex: 1,
        justifyContent: "center"
    }
});

const menuStyles = 
{
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
 
export interface AbstractListItemPropsVirtual<ModelType>
{
    item: ModelType,
    index: number,
    onItemSelected?: (item: ModelType, index: number) => void,
    onContextMenuItemSelected?: (item: ModelType, index: number, option: ActionOption) => void
}

interface AbstractListItemPropsSealed<ModelType>
{
    content: (item: ModelType) => JSX.Element,
}

type Props<ModelType> = AbstractListItemPropsVirtual<ModelType> & AbstractListItemPropsSealed<ModelType>

interface State<ModelType>
{
    item: ModelType,
    index: number,
    actions: Array<ActionOption>
}

export default class AbstractListItem<ModelType> extends Component<Props<ModelType>, State<ModelType>>
{
    private isMounted: boolean = false;
    private menu: any | null = null;

    constructor(props: Props<ModelType>)
    {
        super(props);

        this.state = {
            item: this.props.item,
            index: this.props.index,
            actions: []
        }
    }

    componentWillReceiveProps = (props: Props<ModelType>) =>
    {   
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
        if(this.menu)
        {   this.menu.openMenu();}
    }

    onContextMenuItemSelected = (action: ActionOption) => () =>
    {
        if(this.props.onContextMenuItemSelected)
        {   this.props.onContextMenuItemSelected(this.state.item, this.state.index, action);}
    }

    addContextMenuItem = (action: ActionOption) =>
    {
        var actions = this.state.actions;
        actions.push(action);

        if(this.isMounted)
        {   this.setState({actions: actions});}
        else
        {   this.state = {...this.state, actions};}
    }

    componentWillMount = () =>
    {
        this.isMounted = true;
    }

    componentWillUnmount = () =>
    {
        this.isMounted = false;
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
                            {this.props.content(this.state.item)}
                        </View>
                        {this.hasContextMenuItems() && 
                            <Menu ref={instance => this.menu = instance}>
                                <MenuTrigger customStyles={menuStyles.menuTrigger}> 
                                    <Icon size={30} name="more-vert" />
                                </MenuTrigger>
                                <MenuOptions customStyles={menuStyles.menuOptions}>
                                    {this.state.actions.map(action => {
                                        return <MenuOption key={action.id} text={action.text} onSelect={this.onContextMenuItemSelected(action)} />
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