import React from "react";
import {BackHandler} from "react-native";
import withStaticFields from "./WithStaticFields"
import AbstractHigherOrderComponent from './AbstractHigherOrderComponent';

//Higher order component for intercepting the hardware back button press. The following methods can be implemented by the WrappedComponent:
//onHardwareBackPress: Should return true if the event was handled, and false if not. This decides whether the event bubbles up.
//onSoftwareBackPress: Should return true if the event was handled, and false if not. This decides whether the event bubbles up.
export default WithBackButtonInterceptor = (WrappedComponent) =>
{
    const hoc = class withBackButtonInterceptor extends AbstractHigherOrderComponent
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
            const results = this.callForEachListener("onSoftwareBackPress");
            return results.some(e => e == true);
        }

        onHardwareBackPress = () =>
        {
            const results = this.callForEachListener("onHardwareBackPress");
            return results.some(e => e == true); 
        }
        
        render()
        {   return <WrappedComponent ref={instance => this.wrapped = instance} {...this.props} />}
    }

    return withStaticFields(WrappedComponent, hoc);
}