import React, {Component} from 'react';
import {View } from 'react-native';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractPreferenceDialog from '../preferences/AbstractPreferenceDialog';
import PropTypes from 'prop-types';
import {Text} from "react-native-paper";
import InputTime from '../../inputs/InputTime';
import UtilityTime from '../../../utilities/UtilityTime';

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
        var storageValue = this.state.storageValue;
        storageValue[field] = time;
        this.onValueChange(storageValue);
    }

    onValueValidation = (storageValue) => 
    {
        if(storageValue.start == null || storageValue.start == undefined)
        {   return "Please select a start time for the interruption.";}

        if(storageValue.end == null || storageValue.end == undefined)
        {   return "Please select an end time for the interruption.";}

        if(storageValue.end < storageValue.start)
        {   return "The end of the interruption cannot be before the start of the interruption.";}

        if(storageValue.previous && storageValue.start < storageValue.previous)
        {   return "The start of the interruption cannot be before the end of the previous interruption in line (" +  UtilityTime.dateToHHMM(new Date(storageValue.previous)) + ").";}

        if(storageValue.end > storageValue.next)
        {   return "The end of the interruption cannot be after the start of the next interruption in line (" + UtilityTime.dateToHHMM(new Date(storageValue.next)) + ").";}
    }

    getDialogContent = () => 
    {
        if(this.state.visible == false)
        {   return null;}

        return (
            <View style={styles.wrapper}>
                <View style={styles.inputWrapper}>
                    <InputTime style={styles.input} onTimeSelected={this.onTimeSelected("start")} time={this.state.storageValue.start} /><Text> - </Text><InputTime style={styles.input} onTimeSelected={this.onTimeSelected("end")} time={this.state.storageValue.end} />
                </View>
                {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
            </View>
        );
    }
}  

DialogInterruptionEdit.propTypes = {
}