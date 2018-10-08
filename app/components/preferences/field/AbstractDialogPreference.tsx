import React from 'react';
import {View} from 'react-native';
import { Text } from 'react-native-paper';
import AbstractPreference, { AbstractPreferencePropsVirtual, AbstractPreferenceStyles, AbstractPreferenceState } from "./AbstractPreference";
import { Baseable, onBaseReference } from '../../../render_props/Baseable';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from '../../dialog/preferences/AbstractPreferenceDialog';

export type AbstractDialogPreference_Props_Virtual<StorageValue> = AbstractPreferencePropsVirtual<StorageValue> &
{
    plural?: boolean
}

interface AbstractDialogPreference_Props_Sealed<StorageValue>
{
    toDisplayValue: (storage: StorageValue) => string,
    getDialogComponent: (props: AbstractPreferenceDialog_Props_Virtual<StorageValue>, ref: (ref: Baseable<AbstractPreferenceDialog<StorageValue>> | null) => void) => JSX.Element
}

type Props<StorageValue> = AbstractDialogPreference_Props_Sealed<StorageValue> & AbstractDialogPreference_Props_Virtual<StorageValue>;

interface State
{
    plural: boolean
}

export default class AbstractDialogPreference<StorageValue> extends React.Component<Props<StorageValue>, State> implements Baseable<AbstractPreference<StorageValue>>
{
    private mBase?: AbstractPreference<StorageValue>;
    private dialog?: AbstractPreferenceDialog<StorageValue>;

    constructor(props: Props<StorageValue>)
    {
        super(props);

        this.state =
        {
            plural: props.plural || false
        }
    }

    public get base ()
    {   return this.mBase;}

    onPreferencePress = () =>
    {
        if(this.dialog)
        {   
            const base = this.dialog.base;
            if(base)
            {   base.setVisible(true);}
        }
    }

    onDialogSubmit = (storageValue: StorageValue) =>
    {
        if(this.mBase)
        {   this.mBase.onValueChanged(storageValue);}
    } 

    getEnterMessage = () =>
    {
        var message = "Press to enter ";

        if(this.props.plural == false)
        {   message += "a ";}

        message += this.props.title;
        return message;
    }

    getDisplayContent = (state: AbstractPreferenceState<StorageValue>) =>
    {  
        return (
            <View>
                <Text style={AbstractPreferenceStyles.title}>{this.props.title}</Text>
                {state.displayValue ? <Text style={AbstractPreferenceStyles.displayValue}>{state.displayValue}</Text> : <Text style={AbstractPreferenceStyles.hintValue}>{this.getEnterMessage()}</Text>}
            </View>
        );
    }

    getAdditionalContent = (state: AbstractPreferenceState<StorageValue>) => 
    {   
        const props: AbstractPreferenceDialog_Props_Virtual<StorageValue> = 
        {
            onValueValidation: this.props.onValueValidation,
            title: this.props.title,
            visible: false,  
            storageValue: state.storageValue,
            onSubmit: this.onDialogSubmit
        }

        const onReference = (reference: Baseable<AbstractPreferenceDialog<StorageValue>> | null) => 
        {
            if(reference != null)
            {   this.dialog = reference.base;}
        }

        return this.props.getDialogComponent(props, onReference);
    }

    render()
    {
        return (
            <AbstractPreference ref={onBaseReference(this)} {...this.props} onPreferencePressInternal={this.onPreferencePress} getDisplayContent={this.getDisplayContent} getAdditionalContent={this.getAdditionalContent} />
        );
    }
} 