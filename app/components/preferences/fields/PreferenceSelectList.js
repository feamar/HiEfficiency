import React, {Component} from 'react';
import {View} from 'react-native';
import AbstractPreference from './AbstractPreference';
import DialogPreferenceMultiSelect from '../../dialogs/preferences/DialogPreferenceMultiSelect';
import PropTypes from 'prop-types';
import AbstractDialogPreference from './AbstractDialogPreference';

export default class PreferenceSelectList extends AbstractDialogPreference
{

    constructor(props)
    {
        super(props);

        this.state = {
            options: this.props.options
        }
    }

    getDisplayValue = (storageValue) =>
    {
        if(storageValue < 0 || storageValue > this.state.options.length - 1)
        {   return undefined;}

        return options[storageValue];
    }


    getDialogComponent = (additionalProps) =>
    {
        return (
            <DialogPreferenceSelect {...additionalProps} options={this.props.options} />  
        );
    }
}

PreferenceSelect.propTypes = {
    options: PropTypes.array.isRequired,
}