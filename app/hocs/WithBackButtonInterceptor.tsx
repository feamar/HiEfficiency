import React from "react";
import {BackHandler} from "react-native";
import withStaticFields from "./WithStaticFields"
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from './AbstractHigherOrderComponent';
import { HiEfficiencyNavigator } from "../components/routing/RoutingTypes";

interface HocProps
{   navigation: HiEfficiencyNavigator}

export interface WithBackButtonInterceptorProps
{
    onSoftwareBackPress: () => boolean
    onHardwareBackPress: () => boolean
}

//Higher order component for intercepting the hardware back button press. The following methods can be implemented by the WrappedComponent:
//onHardwareBackPress: Should return true if the event was handled, and false if not. This decides whether the event bubbles up.
//onSoftwareBackPress: Should return true if the event was handled, and false if not. This decides whether the event bubbles up.
export default <B extends ConcreteComponent, C extends ConcreteOrHigher<B, C, WithBackButtonInterceptorProps, P>, P> (WrappedComponent: ConcreteOrHigherConstructor<B, C, WithBackButtonInterceptorProps, P>) =>
{
    const hoc = class withBackButtonInterceptor extends AbstractHigherOrderComponent<B, C, WithBackButtonInterceptorProps, P, HocProps & P>
    {
        componentDidMount() 
        {
            BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);
            this.props.navigation.setParams({onBackClicked: this.onSoftwareBackPress});
        }
        
        componentWillUnmount() 
        {
            BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
        }

        onSoftwareBackPress = () =>
        {
            this.forEachWrappedComponent(componentOrHoc => 
            {
                if(componentOrHoc.onSoftwareBackPress != undefined)
                {   componentOrHoc.onSoftwareBackPress();}
            });

            return false;
        }

        onHardwareBackPress = () =>
        {
            this.forEachWrappedComponent(componentOrHoc => 
            {
                if(componentOrHoc.onHardwareBackPress != undefined)
                {   componentOrHoc.onHardwareBackPress();}
            });

            return false;
        }
        
        render()
        {   
            return <WrappedComponent ref={this.onReference} {...this.props} />
        }
    }

    return withStaticFields(WrappedComponent, hoc);
}