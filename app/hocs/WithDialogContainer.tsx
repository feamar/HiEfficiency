import React from "react";
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from './AbstractHigherOrderComponent';
import { View } from "native-base";
import update, { Spec } from "../../node_modules/immutability-helper";
import withStaticFields from "./WithStaticFields";
import UtilityIndexable from "../utilities/UtilityIndexable";
import AbstractDialog from "../components/dialog/AbstractDialog";
import { AdjustedCallbackReference } from "../render_props/CallbackReference";

export interface WithDialogContainerProps
{
    addDialog: AddDialogCallback,
    removeDialog: (id: string) => boolean,
}

interface State
{
    dialogs: {[id: string]: JSX.Element},
}


interface HocProps
{   }

export type AddDialogCallback = (getDialog: (ref: AdjustedCallbackReference<AbstractDialog>) => JSX.Element, id: string) => boolean;

export default <B extends ConcreteComponent, C extends ConcreteOrHigher<B, C, {}, P>, P extends WithDialogContainerProps> (WrappedComponent: ConcreteOrHigherConstructor<B, C, {}, P>) =>
{
    const hoc = class WithDialogContainer extends AbstractHigherOrderComponent<B, C, {}, P, HocProps & P, State>
    {
        private references: {[id: string] : AbstractDialog} = {};
        constructor(props: HocProps & P)
        {
            super(props);

            this.state = {
                dialogs: {}
            }
        }

        onComponentWillUnmount = () =>
        {
            this.log("onComponentWillUnmount", "Start")

            const keys = Object.keys(this.references);
            keys.forEach(key => 
            {
               const reference = this.references[key];
               if(reference)
               {    reference.setVisible(false);} 
            });
        }

        onDialogReference = (id: string) => (reference: AbstractDialog | undefined) =>
        {
            this.log("onDialogReference", "Start")
            var spec: Spec<{[id: string] : AbstractDialog}, never>;
            if(reference == undefined)
            {   spec = {$unset: [id]};}
            else
            {   spec = {[id]: {$set: reference}};}

            this.references = update(this.references, spec);
        }

        public addDialog: AddDialogCallback = (getDialog: (ref: AdjustedCallbackReference<AbstractDialog>) => JSX.Element, id: string): boolean =>
        {   
            this.log("addDialog", "Adding dialog with id '" + id + "'");
            if(this.state.dialogs[id] != undefined)
            {   return false;}

            const dialog = getDialog(this.onDialogReference(id));
            const newDialogs = update(this.state.dialogs, {[id]: {$set: dialog}});
            if(this.mounted)
            {   this.setState({dialogs: newDialogs})}
            else
            {   this.state = {...this.state, dialogs: newDialogs}}

            return true;
        }

        public removeDialog = (id: string): boolean =>
        {
            this.log("removeDialog", "Removing dialog with id '" + id + "'");
            if(this.state.dialogs[id] == undefined)
            {   return false;}

            const newDialogs = update(this.state.dialogs, {$unset: [id]});
            if(this.mounted)
            {   this.setState({dialogs: newDialogs});}
            else
            {   this.state = {...this.state, dialogs: newDialogs}}

            return true;
        }

        render()
        {   
            this.log("render", "Start");
            return (
                <View>
                    <WrappedComponent addDialog={this.addDialog} removeDialog={this.removeDialog} ref={this.onReference} {...this.props} />
                    {UtilityIndexable.toArray(this.state.dialogs).map(dialog => dialog)}
                </View>
            );
        }

        log = (_method: string, _message: string) =>
        {   
            console.log("WithDialogContainer - " + _method + " - " + _message);
        }
    }
    


    return withStaticFields(WrappedComponent, hoc);
}