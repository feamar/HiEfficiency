import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import { Button, DialogActions } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import PropTypes from 'prop-types';
import AbstractDialog from '../AbstractDialog';

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
            visible: this.props.visible,
            storageValue: this.props.storageValue,
            error: undefined
        }
    }

    setVisible = (visible) =>
    {
        var error = this.state.error;
        if(visible == false)
        {   error = undefined;}

        this.setState({visible: visible, error: error});   
    }

    onDismiss = () =>
    {
        this.setVisible(false);

        if(this.props.onDialogCanceled)
        {   this.props.onDialogCanceled();}
    }

    onSave = () =>
    {
        const error = this.getInputValidationError(this.state.storageValue);
        if(error !== undefined)
        {
            this.setState({error: error});

            if(this.onInputError)
            {   this.onInputError(error);}

            return;
        }

        if(this.props.onDialogSubmitted)
        {   this.props.onDialogSubmitted(this.state.storageValue);}

        this.setState({error: undefined, visible: false});
    }

    onValueChange = (storageValue) =>
    {
        this.setState({storageValue: storageValue});
    }


    getInputValidationError = (storageValue) =>
    {
        if(this.onValueValidation)
        {
            const error = this.onValueValidation(storageValue);
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
            <DialogActions>  
                <Button color={Theme.colors.primary} onPress={this.onDismiss}>Cancel</Button> 
                <Button color={Theme.colors.primary} onPress={this.onSave}>Save</Button>
            </DialogActions>
        );
    }
}

AbstractPreferenceDialog.propTypes = {
    onDialogCanceled: PropTypes.func,
    onDialogSubmitted: PropTypes.func.isRequired,
    onValueValidation: PropTypes.func,
    storageValue: PropTypes.any
}