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
            this.callForEachListener("onScreenWillFocus", payload);
        }

        onScreenDidFocus = (payload) =>
        {
            this.callForEachListener("onScreenDidFocus", payload);
        }

        onScreenWillBlur = (payload) =>
        {
            this.callForEachListener("onScreenWillBlur", payload);
        }

        onScreenDidBlur = (payload) =>
        {
            this.callForEachListener("onScreenDidBlur", payload);
        }
        
        componentWillUnmount()
        {   
            this.unsubscribers.forEach(unsubscriber => unsubscriber.remove());
        }

        render()
        {   return <WrappedComponent ref={instance => this.wrapped = instance} {...this.props} />}
    }

    return withStaticFields(WrappedComponent, hoc);
} 
