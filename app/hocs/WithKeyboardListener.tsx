import React from "react";
import {Keyboard, EmitterSubscription} from "react-native";
import withStaticFields from "./WithStaticFields";
import withFocusListener from "./WithFocusListener";
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from './AbstractHigherOrderComponent';
import { HiEfficiencyNavigator } from "../components/routing/RoutingTypes";

interface RequiredFunctions
{
    onKeyboardDidShow?: () => void,
    onKeyboardDidHide?: () => void
}

interface HocProps 
{
    navigation: HiEfficiencyNavigator
}

export default <B extends ConcreteComponent, C extends ConcreteOrHigher<B, C, RequiredFunctions, P>, P>(WrappedComponent: ConcreteOrHigherConstructor<B, C, RequiredFunctions, P>) =>
{
    const hoc = class WithKeyboardListener extends AbstractHigherOrderComponent<B, C, RequiredFunctions, P, HocProps & P>
    {
        private readonly unsubscribers: Array<EmitterSubscription>;

        constructor(props: P & HocProps)
        {
            super(props);

            this.unsubscribers = [];
        }

        onScreenWillFocus = (_: any) =>
        {
            var unsubscriber = Keyboard.addListener('keyboardDidShow', () => {this.onKeyboardDidShow()});
            this.unsubscribers.push(unsubscriber);
        
            unsubscriber = Keyboard.addListener("keyboardDidHide", () => {this.onKeyboardDidHide()});
            this.unsubscribers.push(unsubscriber);
        }

        onKeyboardDidShow = () =>
        {
            this.forEachWrappedComponent(componentOrHoc => 
            {
                if(componentOrHoc.onKeyboardDidShow != undefined)
                {   componentOrHoc.onKeyboardDidShow();}
            });
        }

        onKeyboardDidHide = () =>
        {   
            this.forEachWrappedComponent(componentOrHoc => 
            {
                if(componentOrHoc.onKeyboardDidHide != undefined)
                {   componentOrHoc.onKeyboardDidHide();}
            });
        }

        onScreenWillBlur = (_: any) =>
        {   this.unsubscribers.forEach(unsubscriber => {unsubscriber.remove()});}

        render()
        {
            return <WrappedComponent ref={this.onReference} {...this.props} />
        }
    }
    
    const hoc1 = withFocusListener(hoc)
    const hoc2 = withStaticFields(WrappedComponent, hoc1);

    return hoc2;
}