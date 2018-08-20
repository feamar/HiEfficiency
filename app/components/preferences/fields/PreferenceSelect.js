import React, {Component} from 'react';
import {View} from 'react-native';
import AbstractPreference from './AbstractPreference';
import DialogPreferenceMultiSelect from '../../dialogs/preferences/DialogPreferenceMultiSelect';
import PropTypes from 'prop-types';

export default class PreferenceSelect extends Component
{

    constructor(props)
    {
        super(props);

        var displayValue = this.getDisplayValue(this.props.storageValue, this.props.options);
        this.state = {
            storageValue: this.props.storageValue,
            displayValue: displayValue,
            options: this.props.options
        }
    }

    handlePress = () =>
    {   this.dialog.base.handleOpen();}

    onDialogCanceled = () =>
    {   } 

    //storageValue is an array of the indexes of the selected options.
    onDialogSubmitted = (storageValue) =>
    {
        var displayValue = this.getDisplayValue(storageValue, this.state.options);        

        this.setState({storageValue: storageValue, displayValue: displayValue});
        this.preference.setValue(displayValue);

        if (this.props.onValueChanged){
            this.props.onValueChanged(storageValue);
        }
    }
 
  
    getDisplayValue = (storageValue, options) =>
    {
        if(storageValue < 0 || storageValue > options.length - 1)
        {   return undefined;}

        return options[storageValue];
    }

    render() 
    {
        return(
            <View>
                <AbstractPreference ref={instance => this.preference = instance} title={this.props.title} value={this.state.displayValue} onPress={this.handlePress} />
                <DialogPreferenceSelect ref={instance => this.dialog = instance} options={this.props.options} title={this.props.title} visible={false} storageValue={this.state.storageValue} label={this.props.title} onDialogCanceled={this.onDialogCanceled} onDialogSubmitted={this.onDialogSubmitted}/>                
            </View>
        );
    }
}

PreferenceSelect.propTypes = {
    onValueChanged: PropTypes.func.isRequired,
    storageValue: PropTypes.number.isRequired,
    options: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
}