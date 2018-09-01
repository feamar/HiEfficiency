import React, {Component} from 'react';
import {View } from 'react-native';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractPreferenceDialog from '../preferences/AbstractPreferenceDialog';
import PropTypes from 'prop-types';
import {Text} from "react-native-paper";
import InputTime from '../../inputs/InputTime';
import UtilityTime from '../../../utilities/UtilityTime';
import { Dropdown } from 'react-native-material-dropdown';
import InterruptionType from '../../../enums/InterruptionType';

const styles = {
    error:{
        fontWeight: "bold",
        color: "red",
        opacity: 0.75
    },
    wrapper: {
        marginLeft: 25, 
        marginRight: 25,
    },
    inputWrapper:
    {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 5
    },
    input:
    {
        flex: 1,
        width: "100%"
    },
    fieldTitle:
    {
        color: Theme.colors.primary
    },
    fieldTitle2:
    {
        color: Theme.colors.primary,
        marginTop: 10
    }
}
export default class DialogInterruptionEdit extends AbstractPreferenceDialog
{

    constructor(props)
    {
        super(props);
    }

    onTimeSelected = (field) => (time) =>
    {
        const storageValue = this.state.storageValue;
        storageValue[field] = time;
        this.onValueChange(storageValue);
    }

    onInterruptionTypeSelected = (value, index, options) =>
    {
        const storageValue = this.state.storageValue;
        storageValue.type = options[index].storageValue;
        this.onValueChange(storageValue);
    }

    onValueValidation = (storageValue) => 
    {
        var error = undefined;
        if(storageValue.start == null || storageValue.start == undefined)
        {   error = "Please select a start time for the interruption.";}

        if(storageValue.end == null || storageValue.end == undefined)
        {   error = "Please select an end time for the interruption.";}

        if(storageValue.end < storageValue.start)
        {   error = "The end of the interruption cannot be before the start of the interruption.";}

        if(storageValue.previous && storageValue.start < (storageValue.previous.timestamp + storageValue.previous.duration))
        {   error = "The start of the interruption cannot be before the end of the previous interruption in line (" +  UtilityTime.dateToHHMM(new Date(storageValue.previous.timestamp + storageValue.previous.duration)) + ").";}

        if(storageValue.next && storageValue.end > storageValue.next.timestamp)
        {   error = "The end of the interruption cannot be after the start of the next interruption in line (" + UtilityTime.dateToHHMM(new Date(storageValue.next.timestamp)) + ").";}

        return error;
    }

    getSpinnerOptions = () =>
    {   return InterruptionType.Values.map(type => {return {value: type.title, storageValue: type.dbId}});}

    getDisplayValue = (storageValue) =>
    {
        const type = InterruptionType.fromDatabaseId(storageValue);
        console.log("HERE: " + JSON.stringify(type));
        return type.title;
    }

    getDialogContent = () => 
    {
        if(this.state.visible == false)
        {   return null;}

        return (
            <View style={styles.wrapper}>
                <Text style={styles.fieldTitle}>Duration</Text>
                <View style={styles.inputWrapper}>
                    <InputTime style={styles.input} onTimeSelected={this.onTimeSelected("start")} time={this.state.storageValue.start} /><Text> - </Text><InputTime style={styles.input} onTimeSelected={this.onTimeSelected("end")} time={this.state.storageValue.end} />
                </View>
                {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}

                <Text style={styles.fieldTitle2}>Type</Text>
                <Dropdown data={this.getSpinnerOptions()} onChangeText={this.onInterruptionTypeSelected} value={this.getDisplayValue(this.state.storageValue.type)} />
            </View>
        );
    }
}  

DialogInterruptionEdit.propTypes = {
}