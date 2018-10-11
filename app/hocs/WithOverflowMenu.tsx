import React from "react";
import { Menu, MenuOptions, MenuTrigger, MenuOptionProps } from "react-native-popup-menu";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HiEfficiencyNavigator } from "../components/routing/RoutingTypes";
import WithStaticFields from "./WithStaticFields";
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent, ConcreteRef } from "./AbstractHigherOrderComponent";

const styles = {
    menuOptions: {
            optionWrapper:{
            padding:15,
        }
    },
    menuTrigger: {
        triggerWrapper:  
        {
            padding:6 
        }
    }
};


type RequiredFunctions = WithOverflowMenu_RequiredFunctions;
export interface WithOverflowMenu_RequiredFunctions
{
    shouldShowOverflowMenu: () => boolean
    getOverflowMenuItems: () => Array<MenuOptionProps & {key?: string}> | undefined
}

type HocProps<B, P> = ConcreteRef<B> & P  & 
{
    navigation: HiEfficiencyNavigator
}

interface HocState 
{
}


//export default WithOverflowMenu<ScreenProfile, Props>(ScreenProfile);

export default <B extends ConcreteComponent & RequiredFunctions, C extends ConcreteOrHigher<B, C, RequiredFunctions, P>, P> (WrappedComponent: ConcreteOrHigherConstructor<B, C, RequiredFunctions, P>) =>
{
    const hoc = class WithOverflowMenu extends AbstractHigherOrderComponent<B, C, RequiredFunctions, P, HocProps<B, P>, HocState>
    {
        private shouldShowOverflowMenu: boolean = false;
        
        constructor(props: HocProps<B, P>)
        {   super(props);}

        onComponentDidMount = () =>
        {
            const concrete = this.concrete;
            if(concrete)
            {   this.setShowOverflowMenu(concrete.shouldShowOverflowMenu());}
        }

        componentDidUpdate = (_1: HocProps<B, P>, _2: HocState) =>
        {
            const concrete = this.concrete;
            if(concrete)
            {
                const shouldShow = concrete.shouldShowOverflowMenu();
                if(shouldShow != this.shouldShowOverflowMenu)
                {   this.setShowOverflowMenu(shouldShow);}
            }
        }

        setShowOverflowMenu = (shouldShow: boolean) =>
        {
            this.shouldShowOverflowMenu = shouldShow;

            if(shouldShow)
            {   this.props.navigation.setParams({header_right_injection: this.getOverflowMenu});}
            else
            {   this.props.navigation.setParams({header_right_injection: undefined});}
        }

        getOverflowMenu = (): JSX.Element | undefined =>
        {
            const concrete = this.concrete;
            if(concrete == undefined)
            {   return undefined;}

            const items = concrete.getOverflowMenuItems();
            if(items == undefined || items.length == 0)
            {   return undefined;}

            return (
                <Menu>
                    <MenuTrigger customStyles={styles.menuTrigger}> 
                        <Icon size={30} name="more-vert" color={"white"} />
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptions}>
                        {items.map(item => 
                        {   return item;})}
                    </MenuOptions>
                </Menu>
            );
        }

        render()
        {   return <WrappedComponent ref={this.onReference} {...this.props} />}
    }
    
    return WithStaticFields(WrappedComponent, hoc);
}