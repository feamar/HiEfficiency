import React from "react";
import withStaticFields from "./WithStaticFields";
import AbstractHigherOrderComponent from './AbstractHigherOrderComponent';
import { PARAM_NAME_HEADER_RIGHT_INJECTION } from "../components/routing/Router";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import Icon from 'react-native-vector-icons/MaterialIcons';
const isEqual = require("react-fast-compare");

const styles = {
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
export default WithOverflowMenu = (WrappedComponent) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent
    {
        constructor(props)
        {
            super(props);

            this.shouldShowOverflowMenu = false;
        }

        componentDidMount()
        {
            this.setShowOverflowMenu(this.wrapped.shouldShowOverflowMenu(undefined, undefined));
        }

        componentDidUpdate = (prevProps, prevState, snapshot) =>
        {
            console.log("OVERFLOW DID STATE CHANGES");
            const shouldShow = this.setShowOverflowMenu(this.wrapped.shouldShowOverflowMenu());
            if(shouldShow != this.shouldShowOverflowMenu)
            {
                console.log("OVERFLOW STATE CHANGE SHOULD TRANSITION");
                this.shouldShowOverflowMenu = shouldShow;
                this.setShowOverflowMenu(shouldShow);
            }
        }

        setShowOverflowMenu = (show) =>
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
    
    return withStaticFields(WrappedComponent, hoc);
}