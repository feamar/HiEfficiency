import React from "react";
import withStaticFields from "./WithStaticFields"
import AbstractHigherOrderComponent from './AbstractHigherOrderComponent';

export default withFocusListener = (WrappedComponent) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent
    {
        constructor(props)
        {
            super(props);

            this.unsubscribers = [];
        }

        componentWillMount()
        {
            console.log("withFocusListener - componentWillMount");

            var unsubscriber = this.props.navigation.addListener('willFocus', (payload) => {this.onScreenWillFocus(payload)});
            this.unsubscribers.push(unsubscriber);
        
            unsubscriber = this.props.navigation.addListener('willBlur', (payload) => {this.onScreenWillBlur(payload)});
            this.unsubscribers.push(unsubscriber);

            unsubscriber = this.props.navigation.addListener('didFocus', (payload) => {this.onScreenDidFocus(payload)});
            this.unsubscribers.push(unsubscriber);
        
            unsubscriber = this.props.navigation.addListener('didBlur', (payload) => {this.onScreenDidBlur(payload)});
            this.unsubscribers.push(unsubscriber);
        }

        onScreenWillFocus = (payload) =>
        {
            console.log("withFocusListener - onScreenWillFocus: " + (this.wrapped == undefined) + " " + (this.wrapped.onScreenWillFocus == undefined));
            this.callForEachListener("onScreenWillFocus", payload);
        }

        onScreenDidFocus = (payload) =>
        {
            console.log("withFocusListener - onScreenDidFocus");
            this.callForEachListener("onScreenDidFocus", payload);
        }

        onScreenWillBlur = (payload) =>
        {
            console.log("withFocusListener - onScreenWillBlur");
            this.callForEachListener("onScreenWillBlur", payload);
        }

        onScreenDidBlur = (payload) =>
        {
            console.log("withFocusListener - onScreenDidBlur");
            this.callForEachListener("onScreenDidBlur", payload);
        }
        
        componentWillUnmount()
        {   
            console.log("withFocusListener - componentWillUnmount");
            this.unsubscribers.forEach(unsubscriber => unsubscriber.remove());
        }

        render()
        {   return <WrappedComponent ref={instance => this.wrapped = instance} {...this.props} />}
    }

    return withStaticFields(WrappedComponent, hoc);
} 
