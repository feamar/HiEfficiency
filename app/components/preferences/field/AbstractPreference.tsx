import React, {Component} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
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

export interface AbstractPreference_Props_Virtual<StorageValue>
{
    storageValue: StorageValue,
    title: string
    onValueChanged?: (value: StorageValue) => void,
    onValueValidation?: (value: StorageValue) => string | undefined,
    onPreferencePress?: () => void,
    required?: boolean,
    disabled?: boolean
}

interface AbstractPreference_Props_Sealed<StorageValue>
{
    onValueValidationInternal?: (value: StorageValue) => string | undefined,
    onPreferencePressInternal?: () => void,
    getDisplayContent: (state: AbstractPreferenceState<StorageValue>) => JSX.Element,
    getAdditionalContent?: (state: AbstractPreferenceState<StorageValue>) => JSX.Element,
    toDisplayValue: (storageValue: StorageValue) => string,
    satisfiesRequired: (storageValue: StorageValue) => boolean
}

type Props<StorageValue> = AbstractPreference_Props_Sealed<StorageValue> & AbstractPreference_Props_Virtual<StorageValue>;

export interface AbstractPreferenceState<StorageValue>
{
    disabled: boolean, 
    required: boolean,
    title: string,
    storageValue: StorageValue,
    displayValue: string,
    error?: string
}

export default class AbstractPreference<StorageValue extends {}> extends Component<Props<StorageValue>, AbstractPreferenceState<StorageValue>>
{
  
    constructor(props : Props<StorageValue>)
    {
        super(props);

        this.state = { 
            disabled: props.disabled || false,
            storageValue: props.storageValue || {} as StorageValue,
            title: props.title,
            required: props.required || false,
            displayValue: props.storageValue == null ? "" : props.toDisplayValue(props.storageValue)
        }
    }  

    componentWillReceiveProps = (props: Props<StorageValue>) =>
    {
        if(props.storageValue != this.props.storageValue)
        {   this.setState({storageValue: props.storageValue || this.state.storageValue});}

        if(props.required != this.props.required)
        {   this.setState({required: props.required || this.state.required});}

        if(props.title != this.props.title)
        {   this.setState({title: props.title});}

        if(props.disabled != this.props.disabled)
        {   this.setState({disabled: props.disabled || this.state.disabled});}
    }

    componentWillMount = () =>
    {   this.onValueChanged(this.state.storageValue, false);}

    onValueChanged = (storage: StorageValue, notifyListeners: boolean = true) =>
    {
        const display = this.props.toDisplayValue(storage);
        this.setState({storageValue: storage, displayValue: display});
        
        if(notifyListeners && this.props.onValueChanged)
        {   this.props.onValueChanged(storage);}
    }

    validate = () =>
    {
        const storageValue = this.state.storageValue;
        if(this.props.required)
        {
            if(storageValue == undefined)
            {
                this.setState({error: "Please enter the " + this.props.title.toLowerCase() + "."});    
                return false;
            }

            const satisfiesRequired = this.props.satisfiesRequired(storageValue);
            if(satisfiesRequired == false)
            {
                this.setState({error: "Please enter the " + this.props.title.toLowerCase() + "."});    
                return false;
            }
        }

        this.setState({error: undefined});
        return true;
    }

    getErrorComponent = () =>
    {   return <Text style={AbstractPreferenceStyles.error}>{this.state.error}</Text>;}

    getStorageValue = () =>
    {   return this.state.storageValue;}

    onPreferencePress = () => 
    {
        if(this.state.disabled)
        {   return;}

        if(this.props.onPreferencePressInternal)
        {   this.props.onPreferencePressInternal();}

        if(this.props.onPreferencePress)
        {   this.props.onPreferencePress();}
    }

    getViewStyle = (disabled: boolean): ViewStyle =>
    {
        if(disabled)
        {
            return {
                opacity: 0.75
            }
        }
        
        return {}
    }

    render(){
        return(
            <View style={this.getViewStyle(this.state.disabled)}>
                 <TouchableRipple disabled={this.state.disabled} onPress={this.onPreferencePress}>
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

