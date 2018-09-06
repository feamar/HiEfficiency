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
            console.log("withKeyboardListener - onScreenWillFocus");
            var unsubscriber = Keyboard.addListener('keyboardDidShow', () => {this.onKeyboardDidShow()});
            this.unsubscribers.push(unsubscriber);
        
            unsubscriber = Keyboard.addListener("keyboardDidHide", () => {this.onKeyboardDidHide()});
            this.unsubscribers.push(unsubscriber);
        }

        onScreenWillBlur = (payload) =>
        {
            console.log("withKeyboardListener - onScreenWillBlur");
            this.unsubscribers.forEach(unsubscriber => {unsubscriber.remove()});
        }

        onKeyboardDidShow = () =>
        {
            console.log("withKeyboardListener - onKeyboardDidShow");
            this.callForEachListener("onKeyboardDidShow");
        }

        onKeyboardDidHide = () =>
        {   
            console.log("withKeyboardListener - onKeyboardDidHide");
            this.callForEachListener("onKeyboardDidHide");
        }

        render()
        {
            return <WrappedComponent ref={instance => this.wrapped = instance} {...this.props} />
        }
    }
    
    return withStaticFields(WrappedComponent, withFocusListener(hoc));
}