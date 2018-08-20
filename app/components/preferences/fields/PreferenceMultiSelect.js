import React, {Component} from 'react';
import {View} from 'react-native';
import AbstractPreference from './AbstractPreference';
import DialogPreferenceMultiSelect from '../../dialogs/preferences/DialogPreferenceMultiSelect';
import PropTypes from 'prop-types';

export default class PreferenceMultiSelect extends Component
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
    { 
        console.log("PRESSED OPEN!");  
        this.dialog.base.handleOpen();
    }

    onDialogCanceled = () =>
    {

    } 

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
        var displayValue = "";
        for(var i = 0 ; i < storageValue.length ; i++)
        {
            var optionsIndex = storageValue[i];
            console.log("OPTION INDEX: " + optionsIndex);
            displayValue += options[optionsIndex];
            if(i < storageValue.length - 2){
                displayValue += ", ";   
            }
            else if(i == storageValue.length - 2)
            {   displayValue += " & ";}
        }

        console.log("Display: " + displayValue);

        return displayValue;
    }

    render() 
    {
        return(
            <View>
                <AbstractPreference ref={instance => this.preference = instance} title={this.props.title} value={this.state.displayValue} onPress={this.handlePress} />
                <DialogPreferenceMultiSelect ref={instance => this.dialog = instance} options={this.props.options} title={this.props.title} visible={false} storageValue={this.state.storageValue} label={this.props.title} onDialogCanceled={this.onDialogCanceled} onDialogSubmitted={this.onDialogSubmitted}/>                
            </View>
        );
    }
}

PreferenceMultiSelect.propTypes = {
    onValueChanged: PropTypes.func.isRequired,
    storageValue: PropTypes.array.isRequired,
    options: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
}