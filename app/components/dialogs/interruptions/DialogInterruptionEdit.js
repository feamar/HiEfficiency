import React, {Component} from 'react';
import {View } from 'react-native';
import { Button, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractPreferenceDialog from '../preferences/AbstractPreferenceDialog';
import {Text} from "react-native-paper";
import UtilityTime from '../../../utilities/UtilityTime';
import { Dropdown } from 'react-native-material-dropdown';
import InterruptionType from '../../../enums/InterruptionType';
import InputDateTimeSeparate from "../../inputs/InputDateTimeSeparate";
import UtilityObject from '../../../utilities/UtilityObject';
import PropTypes from 'prop-types';

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
    },
    fieldTitle3:
    {
        color: Theme.colors.primary,
        marginTop: 10
    },

    field:
    {
        start:
        {
            marginTop: 5,
            marginBottom: 5
        },
        end: {
            marginTop: 5, 
            marginBottom: 5
        },
    }
}
export default class DialogInterruptionEdit extends AbstractPreferenceDialog
{

    constructor(props)
    {
        super(props);

        this.state = {
            ...this.state, 
            storageValue: {
                start: undefined,
                end: undefined,
                type: 0
            }
        }
    }

    onDateTimeSelected = (field) => (timestamp) =>
    {
        //console.log("HERE! Timestamp is: " + timestamp);
        const storageValue = this.state.storageValue;
        storageValue[field] = timestamp;
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
        console.log("ON VALUE VALIDATION: " + UtilityObject.stringify(storageValue));
        var error = undefined;
        if(storageValue.start == null || storageValue.start == undefined)
        {   error = "Please select a start time for the interruption.";}

        if(storageValue.end == null || storageValue.end == undefined)
        {   error = "Please select an end time for the interruption.";}

        if(storageValue.end < storageValue.start)
        {   error = "The end of the interruption cannot be before the start of the interruption.";}

        if(storageValue.previous && storageValue.start.getTime() < (storageValue.previous.timestamp.getTime() + storageValue.previous.duration))
        {   
            const date = new Date(storageValue.previous.timestamp.getTime() + storageValue.previous.duration);
            const previousTime = "on " + UtilityTime.dateToString(date) + " at " + UtilityTime.dateToHHMM(date);
            error = "The start of the interruption cannot be before the end of the previous interruption in line (" + previousTime + ").";
        }

        if(storageValue.next && storageValue.end > storageValue.next.timestamp)
        {   
            const date = new Date(storageValue.next.timestamp);
            const nextTime = "on " + UtilityTime.dateToString(date) + " at " + UtilityTime.dateToHHMM(date);
            error = "The end of the interruption cannot be after the start of the next interruption in line (" + nextTime + ").";
        }


        return error;
    }
 
    getSpinnerOptions = () =>
    {   return InterruptionType.Values.map(type  => {return {value: type.title, storageValue: type.dbId}});}

    getTypeDisplayValue = (storageValue) =>
    {
        var type = InterruptionType.fromDatabaseId(storageValue);
        if(type == InterruptionType.None)
        {   type = InterruptionType.Values[0];}
        
        return type.title;
    }

    getDialogContent = () => 
    {
        if(this.state.storageValue == undefined)
        {  
            console.log("Storage value is null for DialogInterruptionEdit, thus not rendering.");
            return null;
        }

        console.log("STATEMENTATE: " + UtilityObject.stringify(this.state));
        return (
            <View style={styles.wrapper}>
                <Text style={styles.fieldTitle}>Timestamp Start</Text>
                <InputDateTimeSeparate style={styles.field.start} onSelected={this.onDateTimeSelected("start")} timestamp={this.state.storageValue.start} />
                
                <Text style={styles.fieldTitle2}>Timestamp End</Text>
                <InputDateTimeSeparate style={styles.field.end} onSelected={this.onDateTimeSelected("end")} timestamp={this.state.storageValue.end} />
                {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}

                <Text style={styles.fieldTitle3}>Type</Text>
                <Dropdown data={this.getSpinnerOptions()} onChangeText={this.onInterruptionTypeSelected} value={this.getTypeDisplayValue(this.state.storageValue.type)} />
            </View>
        );
    }
}  

DialogInterruptionEdit.propTypes = {
}



//<InputTime style={styles.input} onTimeSelected={this.onTimeSelected("start")} time={this.state.storageValue.start} />
//<InputTime style={styles.input} onTimeSelected={this.onTimeSelected("end")} time={this.state.storageValue.end} />