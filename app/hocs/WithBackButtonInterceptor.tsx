import React from "react";
import {BackHandler} from "react-native";
import withStaticFields from "./WithStaticFields"
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from './AbstractHigherOrderComponent';
import { HiEfficiencyNavigator } from "../components/routing/RoutingTypes";
import UtilityObject from "../utilities/UtilityObject";

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
        onComponentDidMount = () =>
        {
            BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);
            this.props.navigation.setParams({onBackClicked: this.onSoftwareBackPress});
        }
        
        onComponentWillUnmount = () =>  
        {
            BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
        }

        onSoftwareBackPress = () =>
        {
            const results: Array<boolean> = this.forEachWrappedComponent(componentOrHoc => 
            {
                if(componentOrHoc.onSoftwareBackPress != undefined)
                {   return componentOrHoc.onSoftwareBackPress();}
                return false;
            });

            const wasHandled = results.some(e => e == true);
            console.log("Software Back Press Was Handled: " + wasHandled);
            return wasHandled;
        }

        onHardwareBackPress = () =>
        {
            const results: Array<boolean>  = this.forEachWrappedComponent(componentOrHoc => 
            {
                if(componentOrHoc.onHardwareBackPress != undefined)
                {   return componentOrHoc.onHardwareBackPress();}

                return false;
            });

            const wasHandled = results.some(e => e == true);
            console.log("Hardware Back Press Was Handled: " + wasHandled + " WITH: " + UtilityObject.stringify(results));
            return wasHandled;
        }
        
        render()
        {   
            return <WrappedComponent ref={this.onReference} {...this.props} />
        }
    }

    return withStaticFields(WrappedComponent, hoc);
}