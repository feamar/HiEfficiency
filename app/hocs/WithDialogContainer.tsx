import React from "react";
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from './AbstractHigherOrderComponent';
import { View } from "native-base";
import update from "../../node_modules/immutability-helper";
import withStaticFields from "./WithStaticFields";

export interface WithDialogContainerProps
{
    addDialog: (dialog: JSX.Element) => boolean;
    removeDialog: (dialog: JSX.Element) => boolean;
}

interface HocState
{   dialogs: Array<JSX.Element>;}

interface HocProps
{   }

export default <B extends ConcreteComponent, C extends ConcreteOrHigher<B, C, {}, P>, P extends WithDialogContainerProps> (WrappedComponent: ConcreteOrHigherConstructor<B, C, {}, P>) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent<B, C, {}, P, HocProps & P, HocState>
    {
        constructor(props: HocProps & P)
        {
            super(props);

            this.state = {
                dialogs: []
            }
        }

        public addDialog = (dialog: JSX.Element): boolean =>
        {   
            if(this.state.dialogs.indexOf(dialog) >= 0)
            {   return false;}

            const newDialogs = update(this.state.dialogs, {$push: [dialog]});
            this.setState({dialogs: newDialogs});
            return true;
        }

        public removeDialog = (dialog: JSX.Element): boolean =>
        {
            const index = this.state.dialogs.indexOf(dialog);
            if(index < 0)
            {   return false;}

            const newDialogs = update(this.state.dialogs, {$splice: [[index, 1]]});
            this.setState({dialogs: newDialogs});
            return true;
        }

        render()
        {   
            return (
                <View>
                    <WrappedComponent addDialog={this.addDialog} removeDialog={this.removeDialog} ref={this.onReference} {...this.props} />
                    {this.state.dialogs.map(dialog => dialog)}
                </View>
            );
        }
    }
    
    return withStaticFields(WrappedComponent, hoc);
}