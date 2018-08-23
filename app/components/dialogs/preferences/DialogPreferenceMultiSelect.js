import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Checkbox, Text } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractPreferenceDialog from './AbstractPreferenceDialog';
import { Item } from 'native-base';
import PropTypes from 'prop-types';

export const VALUE_SEPARATOR = "|";

const styles = {
    item: {
        flexDirection: "row",
        paddingTop: 3,
        paddingBottom: 3,
        justifyContent: "space-between"
    },
    title: {
        paddingTop: 9
    },
    checkbox: {}
}

export default class DialogPreferenceMultiSelect extends AbstractPreferenceDialog 
{
    constructor(props) 
    {
        super(props);

        this.state = 
        {
            ...this.state,
            options: this.props.options,
        }
    }

    onCheckboxPress = (index) => () => {
        var newStorageValue = this.state.storageValue;
        var i = this.state.storageValue.indexOf(index);
        if(i > -1)
        {   newStorageValue.splice(i, 1); }
        else
        {   newStorageValue.push(index);}

        this.onValueChange(newStorageValue);
    }

    getCheckboxFor = (item, index) => {

        //Check whether the current value array contains the current index.
        var checked = this.state.storageValue.indexOf(index) > -1; 

        return (
            <View style={styles.item} key={index}>
                <Text style={styles.title}>{item}</Text>
                <Checkbox style={styles.checkbox} checked={checked} onPress={this.onCheckboxPress(index)} />
            </View>
        );
    } 

    getDialogContent = () =>
    {
        return (
            <View style={{margin: 25}}>
                {this.state.options.map((item, index) => {
                    return this.getCheckboxFor(item, index)
                })}
            </View>
        ); 
    }
}  
/*  */


DialogPreferenceMultiSelect.propTypes ={
    options: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired   
}