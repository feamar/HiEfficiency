import React from "react";
import {Keyboard} from "react-native";
import withStaticFields from "./WithStaticFields";
import withFocusListener from "./WithFocusListener";
import AbstractHigherOrderComponent from './AbstractHigherOrderComponent';

export default withKeyboardListener = (WrappedComponent) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent
    {
        constructor(props)
        {
            super(props);

            this.unsubscribers = [];
        }

        onScreenWillFocus = (payload) =>
        {
            var unsubscriber = Keyboard.addListener('keyboardDidShow', () => {this.onKeyboardDidShow()});
            this.unsubscribers.push(unsubscriber);
        
            unsubscriber = Keyboard.addListener("keyboardDidHide", () => {this.onKeyboardDidHide()});
            this.unsubscribers.push(unsubscriber);
        }

        onScreenWillBlur = (payload) =>
        {
            this.unsubscribers.forEach(unsubscriber => {unsubscriber.remove()});
        }

        onKeyboardDidShow = () =>
        {
            this.callForEachListener("onKeyboardDidShow");
        }

        onKeyboardDidHide = () =>
        {   
            this.callForEachListener("onKeyboardDidHide");
        }

        render()
        {
            return <WrappedComponent ref={instance => this.wrapped = instance} {...this.props} />
        }
    }
    
    return withStaticFields(WrappedComponent, withFocusListener(hoc));
}