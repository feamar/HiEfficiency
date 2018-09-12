import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Checkbox, Text, TextInput, Divider, TouchableRipple } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractPreferenceDialog from './AbstractPreferenceDialog';
import { Item } from 'native-base';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-native-modal-datetime-picker';

export const VALUE_SEPARATOR = "|";

const styles = {
    item: {
        paddingTop: 3,
        paddingBottom: 3,
    },
    title: {
        fontWeight: "bold",
        paddingTop: 9,

    },
    wrapper:
    {
        width: "100%",
        paddingLeft: 25,
        paddingRight: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    checkbox:
    {
        flex: 2,
        marginLeft: 10,
        marginRight: 10
    },
    contentWrapper:
    {
        flex: 1,
        marginRight: 40
    },
    innerWrapper:
    {
    },
    from:
    {

    },
    hyphen:
    {
        paddingTop: 0
    },
    to:
    {
        width: "50%",
        alignItems: "center",
    },
    touchable:
    {
        paddingTop: 5,
        paddingBottom: 5,
        width: "50%",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#CECECE"
    }
}

export default class DialogPreferenceWeekSchema extends AbstractPreferenceDialog 
{
    constructor(props) 
    {
        super(props);

        this.state = 
        {
            ...this.state, 
            pickerVisibilities: [{ 0: false, 1: false }, { 0: false, 1: false }, { 0: false, 1: false }, { 0: false, 1: false }, { 0: false, 1: false }, { 0: false, 1: false }, { 0: false, 1: false }],
            enabled: []
        }
    }

    onCheckboxPress = (index) => () => 
    {
        var newStorageValue = this.state.storageValue;
        newStorageValue[index].enabled = !newStorageValue[index].enabled;

        this.onValueChange(newStorageValue);
    }

    onTimeConfirmed = (index, fromOrTo) => (time) => 
    {
        this.closeTimePicker(index, fromOrTo);

        var hours = time.getHours();
        var minutes = time.getMinutes();

        if (hours < 10) { hours = "0" + hours; }

        if (minutes < 10) { minutes = "0" + minutes; }

        var timeString = hours + ":" + minutes;
        var newStorageValue = this.state.storageValue;

        //Check if the inputted time is valid (i.e. "to" is not before "from").
        if (fromOrTo == 0) {
            //"From" is being set.
            var to = newStorageValue[index][1];
            if (this.isBefore(timeString, to) == false) {
                alert("The end of your workday should be later than the start of your workday.");
                return;
            }
        }
        else {
            //"To" is being set.
            var from = newStorageValue[index][0];
            if (this.isBefore(timeString, from)) {
                alert("The end of your workday should be later than the start of your workday.");
                return;
            }
        }

        newStorageValue[index][fromOrTo] = timeString;
        this.onValueChange(storageValue);
    }

    isBefore = (t1, t2) => {
        var split1 = t1.split(":");
        var split2 = t2.split(":");

        if (split1[0] < split2[0]) {
            return true;
        }

        if (split1[0] > split2[0]) {
            return false;
        }

        if (split1[1] < split2[1]) {
            return true;
        }

        return false;
    }

    openTimePicker = (index, fromOrTo) => () => {
        if (this.isEnabled(index) == false) { return; }

        var newVisiblities = this.state.pickerVisibilities;
        newVisiblities[index][fromOrTo] = !newVisiblities[index][fromOrTo];

        this.setState({ pickerVisibilities: newVisiblities });
    }

    closeTimePicker = (index, fromOrTo) => {
        var newVisibilities = this.state.pickerVisibilities;
        newVisibilities[index][fromOrTo] = false;

        this.setState({ newVisibilities });
    }

    onCancel = (index, fromOrTo) => () => { this.closeTimePicker(index, fromOrTo); }

    getInnerWrapperStyle = (index) => {
        var style = {
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%"
        };

        if (this.isEnabled(index) == false) { style["opacity"] = 0.4; }

        return style;
    }

    isEnabled = (index) => { return this.state.storageValue[index].enabled; }

    getInitialPickerTime = (index, fromOrTo) => {
        var str = this.state.storageValue[index][fromOrTo];
        var split = str.split(":");

        var date = new Date(0, 0, 0, parseInt(split[0]), parseInt(split[1]), 0, 0);
        return date;
    }

    getTimespanFor = (item, index) => {
        //console.log("getTimespanFor: " + JSON.stringify(JSON.decycle(this.state.storageValue)));

        //Check whether the current value array contains the current index.
        const enabled = this.isEnabled(index);
        const status = enabled ? "checked" : "unchecked";
        return (
            <View style={styles.item} key={index}>
                <View style={styles.wrapper}>
                    <View style={styles.contentWrapper}>
                        <Text style={styles.title}>{item}</Text>
                        <View style={this.getInnerWrapperStyle(index)}>
                            <TouchableRipple disabled={enabled == false} style={styles.touchable} onPress={this.openTimePicker(index, 0)}><Text>{this.state.storageValue[index][0]}</Text></TouchableRipple>
                            <Text style={styles.hyphen}> - </Text>
                            <TouchableRipple disabled={enabled == false} style={styles.touchable} onPress={this.openTimePicker(index, 1)}><Text>{this.state.storageValue[index][1]}</Text></TouchableRipple>
                        </View>
                    </View>
                    <Checkbox style={styles.checkbox} status={status} onPress={this.onCheckboxPress(index)} />
                </View>
                <DateTimePicker datePickerModeAndroid="default" date={this.getInitialPickerTime(index, 0)} onCancel={this.onCancel(index, 0)} mode="time" isVisible={this.state.pickerVisibilities[index][0]} onConfirm={this.onTimeConfirmed(index, 0)} />
                <DateTimePicker datePickerModeAndroid="default" date={this.getInitialPickerTime(index, 1)} onCancel={this.onCancel(index, 1)} mode="time" isVisible={this.state.pickerVisibilities[index][1]} onConfirm={this.onTimeConfirmed(index, 1)} />
            </View>
        );
    }
    getDialogContent = () =>
    {
        return (
            <View>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((item, index) => {
                    return this.getTimespanFor(item, index)
                })}
            </View>
        );
    }
}

DialogPreferenceWeekSchema.propTypes = {
    label: PropTypes.string.isRequired
}