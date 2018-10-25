import React from "react";
import withStaticFields from "./WithStaticFields"
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from './AbstractHigherOrderComponent';
import { HiEfficiencyNavigator } from "../components/routing/RoutingTypes";
import { NavigationEventSubscription } from "react-navigation";

interface HocProps
{
    navigation: HiEfficiencyNavigator
}

export interface RequiredFunctions 
{
    onScreenWillFocus?: (payload: any) => void,
    onScreenDidFocus?: (payload: any) => void,
    onScreenWillBlur?: (payload: any) => void,
    onScreenDidBlur?: (payload: any) => void
}

export default <B extends ConcreteComponent, C extends ConcreteOrHigher<B, C, RequiredFunctions, P>, P extends HocProps> (WrappedComponent: ConcreteOrHigherConstructor<B, C, RequiredFunctions, P>) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent<B, C, RequiredFunctions, P, HocProps & P>
    {
        private readonly unsubscribers: Array<NavigationEventSubscription>;

        constructor(props: HocProps & P)
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
        
        onComponentDidMount = () =>
        {   this.unsubscribers.forEach(unsubscriber => unsubscriber.remove());}

        render()
        {   return <WrappedComponent ref={this.onReference} {...this.props} />}
    }

    return withStaticFields(WrappedComponent, hoc);
} 
