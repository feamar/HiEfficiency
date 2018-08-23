import React, {Component} from 'react';
import {View} from 'react-native';
import AbstractPreference from './AbstractPreference';
import DialogPreferenceMultiSelect from '../../dialogs/preferences/DialogPreferenceMultiSelect';
import PropTypes from 'prop-types';
import DialogPreferenceWeekSchema from '../../dialogs/preferences/DialogPreferenceWeekSchema';
import AbstractDialogPreference from './AbstractDialogPreference';

export default class PreferenceWeekSchema extends AbstractDialogPreference
{
    constructor(props)
    {   super(props);}

    getDisplayValue = (storageValue) =>
    {
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

            totalHours += difference;
        } 
      
        //Round it to two decimal places.
        totalHours = Math.round((totalHours * 100 ) / 100);

        var displayValue = "A " + totalHours + " hour workweek.";
        return displayValue;
    }

    getDialogComponent = (additionalProps) =>
    {
        return (
            <DialogPreferenceWeekSchema {...additionalProps} />  
        );
    }
} 
 