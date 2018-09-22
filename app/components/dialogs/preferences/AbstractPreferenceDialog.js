import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import { Button, Dialog } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import PropTypes from 'prop-types';
import AbstractDialog from '../AbstractDialog';
import UtilityObject from "../../../utilities/UtilityObject";

const styles ={
    content:{
        maxHeight: "75%"
    }
}

export default class AbstractPreferenceDialog extends AbstractDialog
{
    constructor(props) 
    {
        super(props);

        this.state = {
            ...this.state,
            visible: this.props.visible,
            storageValue: this.props.storageValue,
            error: undefined
        }

        this.onCloseListeners.push(this.onDialogClosed);
        this.onDismissListeners.push(this.onDialogDismiss);
    }

    onDialogClosed = () =>
    {       console.log("AbstractPreferenceDialog.onDialogClosed"); setTimeout(() => this.setState({error: undefined, storageValue: this.getOriginalStorageValue()}), 500);}

    onDialogDismiss = () =>
    {
        console.log("AbstractPreferenceDialog.onDialogDismiss"); 
        if(this.props.onDialogCanceled)
        {   this.props.onDialogCanceled();}
    }

    getOriginalStorageValue = () =>
    {   console.log("GET ORIGINAL STORAGE VALUE: " + UtilityObject.stringify(this.props.storageValue));
         return this.props.storageValue;}

    onSave = () =>
    {
        const error = this.getInputValidationError(this.state.storageValue);
        console.log("ON SAVE: " + error);
        if(error !== undefined)
        {
            this.setState({error: error});

            if(this.onInputError)
            {   this.onInputError(error);}

            return;
        }

        if(this.props.onDialogSubmitted)
        {   this.props.onDialogSubmitted(this.state.storageValue);}

        this.setState({error: undefined});
        this.setVisible(false);
    }

    onValueChange = (storageValue) =>
    {
        console.log("STROAGEVALE: " + UtilityObject.stringify(storageValue));
        if(storageValue == undefined)
        {   return;}

        this.setState({storageValue: storageValue});
    }


    getInputValidationError = (storageValue) =>
    {
        console.log("GET INPUT VALIDATION ERROR: " + this.props.required  +" AND " + (storageValue == undefined) + " AND " + (storageValue == ""));
        if(this.props.required && (storageValue == undefined || storageValue == ""))
        {   return "Please enter a value first.";}

        if(this.onValueValidation)
        {
            const error = this.onValueValidation(storageValue);
            console.log("RECEIVED ERROR: " + error);
            if(error !== undefined)
            {   return error;}
        }

        if(this.props.onValueValidation === undefined)
        {   return undefined;}

        return this.props.onValueValidation(storageValue);
    }

    getDialogActions = ()  =>
    { 
        return (
            <Dialog.Actions>  
                <Button color={Theme.colors.primary} onPress={this.onDismiss}>Cancel</Button> 
                <Button color={Theme.colors.primary} onPress={this.onSave}>OK</Button>
            </Dialog.Actions>
        );
    }
}

AbstractPreferenceDialog.defaultProps = {
    required: false
}

AbstractPreferenceDialog.propTypes = {
    onDialogCanceled: PropTypes.func,
    onDialogSubmitted: PropTypes.func.isRequired,
    onValueValidation: PropTypes.func,
    storageValue: PropTypes.any,
    required: PropTypes.bool
}