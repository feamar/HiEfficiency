import React from "react";
import withStaticFields from "./WithStaticFields";
import AbstractHigherOrderComponent from './AbstractHigherOrderComponent';
import { View } from "native-base";
import update from "../../node_modules/immutability-helper";
import UtilityObject from "../utilities/UtilityObject";

export default WithDialogContainer = (WrappedComponent) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent
    {
        constructor(props)
        {
            super(props);

            this.state = {
                dialogs: []
            }
        }

        addDialog = (dialog) =>
        {   
            //console.log("Adding dialog!: " + this.state.dialogs.length);
            if(this.state.dialogs.indexOf(dialog) >= 0)
            {   return false;}

            const newDialogs = update(this.state.dialogs, {$push: [dialog]});
            //console.log("New size: " + newDialogs.length);
            this.setState({dialogs: newDialogs});
            return true;
        }

        removeDialog = (dialog) =>
        {
            //console.log("Dialog is not undefined: " + (dialog != undefined));
            //console.log("Removing dialog!: " + this.state.dialogs.length + " AND: " + UtilityObject.stringify(dialog));
            const index = this.state.dialogs.indexOf(dialog);
            if(index < 0)
            {   return false;}


            const newDialogs = update(this.state.dialogs, {$splice: [[index, 1]]});
            //console.log("New size!: " + newDialogs.length);
            this.setState({dialogs: newDialogs});
            return true;
        }

        render()
        {   
            return (
                <View>
                    <WrappedComponent addDialog={this.addDialog} removeDialog={this.removeDialog} ref={instance => this.wrapped = instance} {...this.props} />
                    {this.state.dialogs.map(dialog => dialog)}
                </View>
            );
        }
    }
    
    return withStaticFields(WrappedComponent, hoc);
}