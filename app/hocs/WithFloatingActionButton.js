import React from "react";
import withStaticFields from "./WithStaticFields";
import withKeyboardListener from "./WithKeyboardListener";
import AbstractHigherOrderComponent from './AbstractHigherOrderComponent';

export default withFloatingActionButton = (WrappedComponent) =>
{        
    const hoc = class HOC extends AbstractHigherOrderComponent
    {
        constructor(props) 
        {
            super(props);

            this.state = {
                visible: true
            }
        }

        componentDidMount()
        {
            console.log("withFloatingActionButton - componentWillMount");
            this.mounted = true;
            this.notify(this.state.visible)
        }

        componentWillUnmount()
        {
            console.log("withFloatingActionButton - componentWillUnmount");
            this.mounted = false;
        }

        onKeyboardDidShow = () =>
        {
            console.log("withFloatingActionButton - onKeyboardDidShow");
            this.notify(false);
        }

        onKeyboardDidHide = () =>
        {
            console.log("withFloatingActionButton - onKeyboardDidHide");
            this.notify(true);
        }

        notify = (visible) =>
        {
            console.log("withFloatingActionButton - notify(" + visible + ")");
            if(this.mounted)
            {
                this.setState({visible: visible}, () => 
                {
                    this.callForEachListener("setFabVisibility", visible);
                });
            }
            else
            {
                this.state = {
                    ...this.state, 
                    visible: visible
                }

                this.callForEachListener("setFabVisibility", visible);
            }
        }

        render()
        {   return <WrappedComponent ref={instance => this.wrapped = instance} {...this.props} />}
    }

    return withStaticFields(WrappedComponent, withKeyboardListener(hoc));
}