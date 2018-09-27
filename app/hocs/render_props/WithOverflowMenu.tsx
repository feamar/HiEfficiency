import React, { Component } from "react";
import { PARAM_NAME_HEADER_RIGHT_INJECTION } from "../components/routing/Router";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet} from "react-native";
import { NavigationProp, NavigationParams, NavigationScreenProp } from "react-navigation";

const styles = StyleSheet.create({
    optionWrapper:{
        padding:15,
    },
    triggerWrapper:  
    {
        padding:6 
    }
});

interface HocProps
{
    shouldShowOverflowMenu: () => boolean,
    navigation: any
}

interface HocState 
{

}




export default class WithOverflowMenu extends React.Component<HocProps, HocState>
{
    
    private shouldShowOverflowMenu: boolean = false;
    constructor(props: HocProps)
    {
        super(props);
    }

    componentDidMount()
    {   this.setShowOverflowMenu(this.props.shouldShowOverflowMenu());}

    componentDidUpdate = (_1: HocProps, _2: HocState) =>
    {
        const shouldShow = this.props.shouldShowOverflowMenu();
        if(shouldShow != this.shouldShowOverflowMenu)
        {
            this.shouldShowOverflowMenu = shouldShow;
            this.setShowOverflowMenu(shouldShow);
        }
    }

    setShowOverflowMenu = (show: boolean) =>
    {
        const parent = this.props.navigation.dangerouslyGetParent();
        if(show)
        {   parent.setParams({[PARAM_NAME_HEADER_RIGHT_INJECTION]: this.getOverflowMenu});}
        else
        {   parent.setParams({[PARAM_NAME_HEADER_RIGHT_INJECTION]: undefined});}
    }

    getOverflowMenu = () =>
    {
        const items = this.wrapped.getOverflowMenuItems();
        if(items == undefined || items.length == 0)
        {   return null;}

        return (
            <Menu>
                <MenuTrigger customStyles={styles.menuTrigger}> 
                    <Icon style={styles.icon} size={30} name="more-vert" color={"white"} />
                </MenuTrigger>
                <MenuOptions customStyles={styles.menuOptions}>
                    {items.map((item, index) => 
                    {   return item;})}
                </MenuOptions>
            </Menu>
        );
    }

    render()
    {   return <WrappedComponent ref={instance => this.wrapped = instance} {...this.props} />}
}
    