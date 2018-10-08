import React from 'react';
import {View} from 'react-native';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from './AbstractPreferenceDialog';
import DateTimePicker from 'react-native-modal-datetime-picker';
import InputDateTimeSeparate from '../../inputs/InputDateTimeSeparate';
import PreferenceCategory from '../../preferences/PreferenceCategory';
import InputError from '../../inputs/InputError';
import { Baseable, onBaseReference } from '../../../render_props/Baseable';


export type DialogPreferenceDateTime_DateTimeMode = "time" | "date" | "datetime" | "datetime-separate";

export interface DialogPreferenceDateTime_StorageValue
{
    timestamp: Date
}

type StorageValue = DialogPreferenceDateTime_StorageValue;

type Props = AbstractPreferenceDialog_Props_Virtual<StorageValue> & 
{
    mode: DialogPreferenceDateTime_DateTimeMode
}

interface State
{
    
}

export default class DialogPreferenceDateTime extends React.Component<Props, State> implements Baseable<AbstractPreferenceDialog<StorageValue>>
{
    private _base: AbstractPreferenceDialog<StorageValue> | undefined;

    constructor(props: Props)
    {   super(props);}

    public get base (): AbstractPreferenceDialog<StorageValue> | undefined 
    {   return this._base;}

    onTimePickerCancel = () =>
    {   }

    onTimePickerConfirmed = (timestamp: Date) =>
    {
        if(this._base == undefined)
        {   return;}

        this._base.onValueChange({timestamp: {$set: timestamp}});
    }

    getInputComponent = (): JSX.Element | null =>
    {
        if(this._base == undefined)
        {   return null;}

        const value = this._base.getCurrentStorageValue();
        if(value)
        {
            switch(this.props.mode)
            {
                case "time":
                case "date":
                case "datetime":
                    return <DateTimePicker datePickerModeAndroid="spinner" date={value.timestamp} onCancel={this.onTimePickerCancel} mode={this.props.mode} isVisible={false} onConfirm={this.onTimePickerConfirmed} />
                
                case "datetime-separate":
                    return <InputDateTimeSeparate onSelected={this.onTimePickerConfirmed} timestamp={value.timestamp} />
            }
        }

        return null;
    }

    
    getErrorComponent = () =>
    {
        if(this._base == undefined)
        {   return null;}

        return <InputError error={this._base.getCurrentError()} />
    }


    getDialogContent = () => 
    {
        return ( 
            <View style={{marginLeft: 25, marginRight: 25}}>
                <PreferenceCategory title="Timestamp">
                    {this.getInputComponent()}
                    {this.getErrorComponent()}
                </PreferenceCategory>
            </View>
        );
    }

    render()
    {
        return (
            <AbstractPreferenceDialog ref={onBaseReference(this)} getDialogContent={this.getDialogContent} {...this.props}/>
        );
    }
}  