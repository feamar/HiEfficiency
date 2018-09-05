import React, {Component} from "react";
import {View, Keyboard} from "react-native";
import hoistNonReactStatics from 'hoist-non-react-statics';

export default class UtilityScreen
{
    static withFloatingActionButton = (Screen) =>
    {
        const hoc = class HOC extends Component
        {
            constructor(props) 
            {
                super(props);

                this.mountUnsubscribers = [];
                this.keyboardUnsubscribers = [];

            }

            componentWillMount()
            {
                console.log(Screen.displayName + ": componentWillMount");
                unsubscriber = this.props.navigation.addListener('willFocus', (payload) => {this.onScreenWillFocus(payload)});
                this.mountUnsubscribers.push(unsubscriber);
            
                unsubscriber = this.props.navigation.addListener('willBlur', (payload) => {this.onScreenWillBlur(payload)});
                this.mountUnsubscribers.push(unsubscriber);
            } 
            
            onScreenWillFocus = (payload) =>
            {
                console.log(Screen.displayName + ": onScreenWillFocus");

                this.screen.setFabVisibility(true);
          
                var unsubscriber = Keyboard.addListener('keyboardDidShow', () => {this.screen.setFabVisibility(false)});
                this.keyboardUnsubscribers.push(unsubscriber);
            
                unsubscriber = Keyboard.addListener("keyboardDidHide", () => {this.screen.setFabVisibility(true)});
                this.keyboardUnsubscribers.push(unsubscriber);
            }
          
            onScreenWillBlur = (payload) =>
            {
                console.log(Screen.displayName + ": onScreenWillBlur");

                this.screen.setFabVisibility(false);
                this.keyboardUnsubscribers.forEach(unsubscriber => {unsubscriber.remove()});
            }
          
            componentWillUnmount()
            {   
                console.log(Screen.displayName + ": componentWillUnmount");

                this.mountUnsubscribers.forEach(unsubscriber => unsubscriber.remove());
            }

            render()
            {
                return (
                    <View>
                        <Screen ref={instance => this.screen = instance} {...this.props} />
                    </View>
                );
            }
        }

        return hoistNonReactStatics(hoc, Screen);
    }
}