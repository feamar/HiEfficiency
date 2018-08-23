import React, {Component} from 'react';
import {View} from 'react-native';
import AbstractPreference from './AbstractPreference';
import DialogPreferenceMultiSelect from '../../dialogs/preferences/DialogPreferenceMultiSelect';
import PropTypes from 'prop-types';
import AbstractDialogPreference from './AbstractDialogPreference';

export default class PreferenceMultiSelect extends AbstractDialogPreference
{

    constructor(props)
    {
        super(props);

        this.state = {
            ...this.state,
            options: this.props.options
        }
    }

    getDisplayValue = (storageValue) =>
    {
        var displayValue = "";
        for(var i = 0 ; i < storageValue.length ; i++)
        {
            var optionsIndex = storageValue[i];
            displayValue += this.state.options[optionsIndex];
        
            if(i < storageValue.length - 2)
            {   displayValue += ", ";}
            else if(i == storageValue.length - 2)
            {   displayValue += " & ";}
        }

        return displayValue;
    }

    getDialogComponent = (additionalProps) =>
    {
        return (
            <DialogPreferenceMultiSelect {...additionalProps} options={this.props.options} />  
        );
    }
}

PreferenceMultiSelect.propTypes = {
    options: PropTypes.array.isRequired,
}