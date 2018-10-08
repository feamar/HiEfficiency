import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Theme from "../../../styles/Theme";

export const AbstractPreferenceStyles = StyleSheet.create({
    root: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    title:{
        fontWeight: "bold"
    },
    displayValue: {
        color: Theme.colors.typography.title
    },
    hintValue: {
        color: Theme.colors.typography.hint
    },
    error: {
        color: "red",
        opacity: 0.55,
        fontWeight: "bold"
    }
});

export interface AbstractPreferencePropsVirtual<StorageValue>
{
    storageValue: StorageValue,
    title: string
    onValueChanged: (value: StorageValue) => void,
    onValueValidation?: (value: StorageValue) => string | undefined,
    onPreferencePress?: () => void,
    required?: boolean
}

interface AbstractPreferencePropsSealed<StorageValue>
{
    onValueValidationInternal?: (value: StorageValue) => string | undefined,
    onPreferencePressInternal?: () => void,
    getDisplayContent: (state: AbstractPreferenceState<StorageValue>) => JSX.Element,
    getAdditionalContent?: (state: AbstractPreferenceState<StorageValue>) => JSX.Element,
    toDisplayValue: (storageValue: StorageValue) => string
}

type Props<StorageValue> = AbstractPreferencePropsSealed<StorageValue> & AbstractPreferencePropsVirtual<StorageValue>;

export interface AbstractPreferenceState<StorageValue>
{
    required: boolean,
    title: string,
    storageValue: StorageValue,
    displayValue: string,
    error?: string
}

export default class AbstractPreference<StorageValue> extends Component<Props<StorageValue>, AbstractPreferenceState<StorageValue>>
{
  
    constructor(props : Props<StorageValue>)
    {
        super(props);

        this.state = { 
            storageValue: props.storageValue,
            title: props.title,
            required: props.required || false,
            displayValue: props.toDisplayValue(props.storageValue)
        }
    }  

    componentWillMount = () =>
    {   this.onValueChanged(this.state.storageValue);}

    onValueChanged = (storage: StorageValue) =>
    {
        const display = this.props.toDisplayValue(storage);
        this.setState({storageValue: storage, displayValue: display});
    }

    validate = () =>
    {
        const storageValue = this.state.storageValue;
        if(this.props.required && (storageValue === undefined || storageValue === null))
        {   
            this.setState({error: "Please enter the " + this.props.title.toLowerCase() + "."});    
            return false;
        }

        return true;
    }

    getErrorComponent = () =>
    {   return <Text style={AbstractPreferenceStyles.error}>{this.state.error}</Text>;}

    getStorageValue = () =>
    {   return this.state.storageValue;}

    onPreferencePress = () => 
    {
        if(this.props.onPreferencePressInternal)
        {   this.props.onPreferencePressInternal();}

        if(this.props.onPreferencePress)
        {   this.props.onPreferencePress();}
    }

    render(){
        return(
            <View>
                 <TouchableRipple disabled={false} onPress={this.onPreferencePress}>
                    <View style={AbstractPreferenceStyles.root}>
                        {this.props.getDisplayContent(this.state)}
                        {this.state.error && this.getErrorComponent()}
                    </View>
                </TouchableRipple>
                {this.props.getAdditionalContent && this.props.getAdditionalContent(this.state)}
            </View>
        );
    }
} 

