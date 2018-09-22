import React, {Component} from 'react';
import {View } from 'react-native';
import { TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractPreferenceDialog from './AbstractPreferenceDialog';
import PropTypes from 'prop-types';
import {Text} from "react-native-paper";
import DateTimePicker from 'react-native-modal-datetime-picker';
import InputDateTimeSeparate from '../../inputs/InputDateTimeSeparate';
import PreferenceCategory from '../../preferences/PreferenceCategory';
import UtilityObject from '../../../utilities/UtilityObject';

const styles = {
    error:{
        fontWeight: "bold",
        color: "red",
        marginTop: 10,
        opacity: 0.75
    }
}

export const MODE_TIME = "time";
export const MODE_DATE = "date";
export const MODE_DATETIME = "datetime";
export const MODE_DATETIME_SEPARATE = "datetime-separate";

export default class DialogPreferenceDateTime extends AbstractPreferenceDialog
{

    constructor(props)
    {
        super(props);

        if(this.props.mode != MODE_DATE && this.props.mode != MODE_TIME && this.props.mode != MODE_DATETIME && this.props.mode != MODE_DATETIME_SEPARATE)
        {   throw new Error("The mode '" + this.props.mode + "' is unsupported. Please pick one of 'MODE_DATE', 'MODE_TIME', 'MODE_DATETIME' or 'MODE_DATETIME_SEPARATE'.");}

        this.state = {
            ...this.state,
            open: false,
            storageValue: this.state.storageValue == undefined ? new Date() : this.state.storageValue
        }
    }

    onTimePickerCancel = () =>
    {   }

    onTimePickerConfirmed = (timestamp) =>
    {   this.onValueChange(timestamp);}

    componentWillReceiveProps(props) 
    {   this.onValueChange(props.storageValue);}

    getInputComponent = () =>
    {
        switch(this.props.mode)
        {
            case MODE_DATE:
            case MODE_TIME:
            case MODE_DATETIME:
                return <DateTimePicker datePickerModeAndroid="default" date={this.state.storageValue} onCancel={this.onTimePickerCancel} mode={this.props.mode} isVisible={this.state.open} onConfirm={this.onTimePickerConfirmed} />
            
            case MODE_DATETIME_SEPARATE:
                return <InputDateTimeSeparate onSelected={this.onTimePickerConfirmed} timestamp={this.state.storageValue} />
        }
    }

    getDialogContent = () => 
    {
        return ( 
            <View style={{marginLeft: 25, marginRight: 25}}>
                <PreferenceCategory title="Timestamp">
                    {this.getInputComponent()}
                    {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
                </PreferenceCategory>
            </View>
        );
    }
}  

DialogPreferenceDateTime.propTypes = {
    mode: PropTypes.any.isRequired
}