import React, {Component} from "react";
import {View, StyleSheet} from "react-native";
import Icon  from "react-native-vector-icons/MaterialIcons";
import {TouchableRipple} from "react-native-paper"
import { Divider } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import ActionOption from "../../../../dtos/options/ActionOption";
import update from "immutability-helper";
import equal from "deep-equal";

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
 
export interface AbstractListItem_Props_Virtual<ModelType>
{
    item: ModelType,
    index: number,
    divider?: boolean,
    onItemSelected?: (item: ModelType, index: number) => void,
    onContextMenuItemSelected?: (item: ModelType, index: number, option: ActionOption) => void
}

interface AbstractListItem_Props_Sealed<ModelType>
{
    content: (item: ModelType) => JSX.Element,
}

type Props<ModelType> = AbstractListItem_Props_Virtual<ModelType> & AbstractListItem_Props_Sealed<ModelType>

interface State<ModelType>
{
    item: ModelType,
    index: number,
    actions: Array<ActionOption>
}

export default class AbstractListItem<ModelType> extends Component<Props<ModelType>, State<ModelType>>
{
    private menu: any | null = null;
    private isMounted: boolean = false;

    constructor(props: Props<ModelType>)
    {
        super(props);

        this.state = {
            item: this.props.item,
            index: this.props.index,
            actions: []
        }
    }

    componentDidMount = () =>
    {   this.isMounted = true;}

    componentWillUnmount = () =>
    {   this.isMounted = false;}

    shouldComponentUpdate = (nextProps: Readonly<Props<ModelType>>, nextState: Readonly<State<ModelType>>, _nextContext: Readonly<any>) =>
    {
        if(equal(nextProps, this.props) && equal(nextState, this.state))
        {   return false;}

        return true;
    }

    componentWillReceiveProps = (props: Props<ModelType>) =>
    {   
        if(this.isMounted == false)
        {   return;}

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

    addContextMenuItem = (action: ActionOption): Promise<boolean> =>
    {
        var newActions: Array<ActionOption>;
        const found = this.state.actions.find(e => e.id == action.id);
        if(found != undefined)
        {
            const index = this.state.actions.indexOf(found);
            newActions = update(this.state.actions, {$splice: [[index, 1, action]]});
        }
        else
        {   newActions = update(this.state.actions, {$push: [action]});}

        return new Promise(resolve => this.setState({actions: newActions}, resolve));
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
                {this.props.divider && <Divider />}
            </View>
        );
    }
}