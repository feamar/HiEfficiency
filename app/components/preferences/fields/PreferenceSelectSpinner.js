import React, {Component} from "react";
import PropTypes from "prop-types";
import {View, ScrollView} from "react-native";
import { Dropdown } from 'react-native-material-dropdown';
import AbstractContainedPreference from "./AbstractContainedPreference";

export default class PreferenceSelectSpinner extends AbstractContainedPreference
{
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
        var displayValue = "";
        if(this.state.storageValue !== undefined && this.state.storageValue !== "")
        {   displayValue = this.props.getDisplayValueFromItem(this.state.storageValue);}

        return displayValue;
    }

    getAdditionalDisplayContent = () =>
    { 
        return (
            <View>
                <Dropdown data={this.props.options} onChangeText={this.onValueSelected} value={this.getDisplayValue(this.state.storageValue)} />
            </View>
        );
    }
}

PreferenceSelectSpinner.propTypes = 
{
    options: PropTypes.array.isRequired,
    getDisplayValueFromItem: PropTypes.func.isRequired
}