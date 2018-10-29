import React from "react";
import withStaticFields from "./WithStaticFields"
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from './AbstractHigherOrderComponent';
import { HiEfficiencyNavigator } from "../components/routing/RoutingTypes";
import { NavigationEventSubscription } from "react-navigation";

export interface WithFocusListener_RequiredProps
{
    navigation: HiEfficiencyNavigator
}

export interface WithFocusListener_RequiredFunctions 
{
    onScreenWillFocus?: (payload: any) => void,
    onScreenDidFocus?: (payload: any) => void,
    onScreenWillBlur?: (payload: any) => void,
    onScreenDidBlur?: (payload: any) => void
}

export default <B extends ConcreteComponent, C extends ConcreteOrHigher<B, C, WithFocusListener_RequiredFunctions, P>, P extends WithFocusListener_RequiredProps> (WrappedComponent: ConcreteOrHigherConstructor<B, C, WithFocusListener_RequiredFunctions, P>) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent<B, C, WithFocusListener_RequiredFunctions, P, WithFocusListener_RequiredProps & P>
    {
        private readonly unsubscribers: Array<NavigationEventSubscription>;

        constructor(props: WithFocusListener_RequiredProps & P)
        {
            super(props);

            this.unsubscribers = [];
        }

        onComponentWillMount = () =>
        {
            var unsubscriber = this.props.navigation.addListener('willFocus', (payload) => {this.onScreenWillFocus(payload)});
            this.unsubscribers.push(unsubscriber);
        
            unsubscriber = this.props.navigation.addListener('willBlur', (payload) => {this.onScreenWillBlur(payload)});
            this.unsubscribers.push(unsubscriber);

            unsubscriber = this.props.navigation.addListener('didFocus', (payload) => {this.onScreenDidFocus(payload)});
            this.unsubscribers.push(unsubscriber);
        
            unsubscriber = this.props.navigation.addListener('didBlur', (payload) => {this.onScreenDidBlur(payload)});
            this.unsubscribers.push(unsubscriber);
        }

        onScreenWillFocus = (payload: any) =>
        {
            this.forEachWrappedComponent(componentOrHoc => 
            {
                if(componentOrHoc.onScreenWillFocus != undefined)
                {   componentOrHoc.onScreenWillFocus(payload);}
            });
        }

        onScreenDidFocus = (payload: any) =>
        {
            this.forEachWrappedComponent(componentOrHoc => 
            {
                if(componentOrHoc.onScreenDidFocus != undefined)
                {   componentOrHoc.onScreenDidFocus(payload);}
            });
        }

        onScreenWillBlur = (payload: any) =>
        {
            this.forEachWrappedComponent(componentOrHoc => 
            {
                if(componentOrHoc.onScreenWillBlur != undefined)
                {   componentOrHoc.onScreenWillBlur(payload);}
            });
        }

        onScreenDidBlur = (payload: any) =>
        {
            this.forEachWrappedComponent(componentOrHoc => 
            {
                if(componentOrHoc.onScreenDidBlur != undefined)
                {   componentOrHoc.onScreenDidBlur(payload);}
            });
        }
        
        onComponentWillUnmount = () =>
        {   this.unsubscribers.forEach(unsubscriber => unsubscriber.remove());}

        render()
        {   return <WrappedComponent ref={this.onReference} {...this.props} />}
    }

    return withStaticFields(WrappedComponent, hoc);
} 
