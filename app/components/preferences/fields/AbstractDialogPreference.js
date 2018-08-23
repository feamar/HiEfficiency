import React, {Component} from 'react';
import {View} from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Divider } from 'react-native-paper';
import AbstractPreference from "./AbstractPreference";

const styles = {
    error:{
        fontWeight: "bold",
        color: "red",
        opacity: 0.75
    }
}

export default class AbstractDialogPreference extends AbstractPreference
{
    constructor(props)
    {
        super(props);
    }

    onPreferencePress = () =>
    {
        if(this.dialog)
        {   this.dialog.setVisible(true);}
    }
    
    onDialogCancel = () =>
    {   
        if(this.onDialogWillCancel)
        {   this.onDialogWillCancel();}

        if(this.onDialogHasCancelled)
        {   this.onDialogHasCancelled();}
    } 

    onDialogSubmit = (storageValue) =>
    {
        if(this.onDialogWillSubmit)
        {   this.onDialogWillSubmit(storageValue);}

        this.setDisplayValueFromStorageValue(storageValue);

        if (this.props.onValueChanged)
        {   this.props.onValueChanged(storageValue);}

        if(this.onDialogHasSubmitted) 
        {   this.onDialogHasSubmitted(storageValue);}
    } 

    getDisplayContent = () =>
    {  
        return (
            <View>
                <Text style={this.styles.title}>{this.props.title}</Text>
                {this.state.displayValue ? <Text style={this.styles.displayValue}>{this.state.displayValue}</Text> : <Text>Press to enter a {this.props.title}.</Text>}
            </View>
        );
    }

    getAdditionalContent = () => 
    {   
        const props = 
        {
            onValueValidation: this.props.onValueValidation,
            title: this.props.title,
            visible: false,  
            storageValue: this.state.storageValue,
            label: this.props.title,
            onDialogCanceled: this.onDialogCancel,
            onDialogSubmitted: this.onDialogSubmit,
            ref: ((instance) => this.dialog = instance)
        }

        return this.getDialogComponent(props);
    }
} 
