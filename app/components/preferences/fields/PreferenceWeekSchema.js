import React, {Component} from 'react';
import {View} from 'react-native';
import AbstractPreference from './AbstractPreference';
import DialogPreferenceMultiSelect from '../../dialogs/preferences/DialogPreferenceMultiSelect';
import PropTypes from 'prop-types';
import DialogPreferenceWeekSchema from '../../dialogs/preferences/DialogPreferenceWeekSchema';

export default class PreferenceWeekSchema extends Component
{
    constructor(props)
    {
        super(props);

        var displayValue = this.getDisplayValue(this.props.storageValue);
        this.state = {
            storageValue: this.props.storageValue,
            displayValue: displayValue
        }
    }

    handlePress = () =>
    { 
        this.dialog.base.handleOpen();
    }

    onDialogCanceled = () =>
    {

    } 

    //storageValue is an array of the indexes of the selected options.
    onDialogSubmitted = (storageValue) =>
    {        
        console.log("Storage Value: " + JSON.stringify(storageValue));
        var displayValue = this.getDisplayValue(storageValue);        

        this.setState({storageValue: storageValue, displayValue: displayValue});
        this.preference.setValue(displayValue);

        if (this.props.onValueChanged){
            this.props.onValueChanged(storageValue);
        }
    }
 
  
    getDisplayValue = (storageValue) =>
    {
        console.log("Storage Value: " + JSON.stringify(storageValue));
        var totalHours = 0;
        for(var i = 0 ; i < storageValue.length ; i ++)
        {
            var currentDay = storageValue[i];
            if(currentDay.enabled == false)
            {   continue;}

            var start = currentDay[0];
            var end = currentDay[1];

            var splitStart = start.split(":");
            var splitEnd = end.split(":");

            //Example:               09:00 - 17:00
            //minutesEnd:            17 * 60 + 0 = 1020
            //minutesStart:          9 * 60 + 0 = 540
            //difference:            1020 - 540 = 480
            //difference in hours:   480 / 60 = 8

            
            var minutesEnd = (parseInt(splitEnd[0]) * 60 + parseInt(splitEnd[1]));
            var minutesStart = (parseInt(splitStart[0]) * 60 + parseInt(splitStart[1]));
            var difference = (minutesEnd - minutesStart) / 60;

            console.log("minutesEnd: " + minutesEnd);
            console.log("minutesStart: "+ minutesStart);
            console.log("difference: " + difference);
            totalHours += difference;
        }
 
        //Round it to two decimal places.
        totalHours = Math.round((totalHours * 100 ) / 100);

        var displayValue = "A " + totalHours + " hour workweek.";
        return displayValue;
    }

    render() 
    {
        return(
            <View>
                <AbstractPreference ref={instance => this.preference = instance} title={this.props.title} value={this.state.displayValue} onPress={this.handlePress} />
                <DialogPreferenceWeekSchema 
                    ref={instance => this.dialog = instance} 
                    title={this.props.title} 
                    visible={false} 
                    storageValue={this.state.storageValue} 
                    label={this.props.title} 
                    onDialogCanceled={this.onDialogCanceled} 
                    onDialogSubmitted={this.onDialogSubmitted}/>  
                                  
            </View>
        );
    }
} 

PreferenceWeekSchema.propTypes = {
    onValueChanged: PropTypes.func.isRequired,
    storageValue: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
}