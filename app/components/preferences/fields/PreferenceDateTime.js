import React from "react";
import PropTypes from "prop-types";
import {View} from "react-native";
import {Text} from "react-native-paper";
import AbstractContainedPreference from "./AbstractContainedPreference";
import UtilityTime from "../../../utilities/UtilityTime";
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class PreferenceDateTime extends AbstractContainedPreference
{

    constructor(props)
    {
        super(props);

        this.state = {
            ...this.state,
            open: false,
            mode: this.props.mode
        }
    }

    onValueSelected = (value, index, options) =>
    {
        const option = options[index];
        const storageValue = option.storageValue;
        this.setDisplayValueFromStorageValue(storageValue);

        if (this.props.onValueChanged)
        {   this.props.onValueChanged(storageValue);}
    }

    getDisplayValue = (storageValue) =>
    {
        var displayValue = "Unknown";
        if(this.state.storageValue !== undefined && this.state.storageValue !== "")
        {   displayValue = UtilityTime.dateToString(storageValue, undefined);}

        return displayValue;
    }
    
    onCancel = () =>
    {   this.close();}

    open = () =>
    {   this.setState({open: true});}
    
    close = () =>
    {   this.setState({open: false});}
 
    onPreferencePress = () =>
    {   this.open();}

    onDateTimeConfirmed = (datetime) =>
    {
        this.setStorageValue(datetime);
        this.close();
        
        if (this.props.onValueChanged)
        {   this.props.onValueChanged(datetime);}
    }

    getAdditionalDisplayContent = () =>
    { 
        return (
            <View>
                <Text>{this.getDisplayValue(this.state.storageValue)}</Text>
                <DateTimePicker datePickerModeAndroid="default" date={this.state.storageValue || new Date()} onCancel={this.onCancel} mode={this.state.mode} isVisible={this.state.open} onConfirm={this.onDateTimeConfirmed} />
            </View>
        );
    }
}

PreferenceDateTime.propTypes = 
{
    mode: PropTypes.string.isRequired
}