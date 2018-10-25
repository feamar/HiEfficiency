import React from 'react';
import {View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from './AbstractPreferenceDialog';
import InputError from '../../inputs/InputError';
import UtilityValidate from '../../../utilities/UtilityValidate';
import { Baseable, onBaseReference } from '../../../render_props/Baseable';

const styles = StyleSheet.create({
    input: {
        marginLeft: 25,
        marginRight: 25
    },
    error: {
        marginLeft: 25,
        marginRight: 25
    }
});

export interface DialogPreferenceText_StorageValue
{
    text?: string
}

type StorageValue = DialogPreferenceText_StorageValue

type Props = AbstractPreferenceDialog_Props_Virtual<StorageValue> & 
{
    legalCharacters?: string,
    multiline?: boolean,
    numberOfLines?: number,
    label: string,
}

interface State 
{
    label: string,
    legalCharacters: string,
    multiline: boolean,
    numberOfLines: number,
}


export default class DialogPreferenceText extends React.Component<Props, State> implements Baseable<AbstractPreferenceDialog<StorageValue>>
{
    public base: AbstractPreferenceDialog<StorageValue> | undefined;

    constructor(props: Props)
    {
        super(props);

        this.state = {
            label: props.label,
            legalCharacters: props.legalCharacters || UtilityValidate.DEFAULT_LEGAL_CHARACTERS,
            multiline: props.multiline || false,
            numberOfLines: props.numberOfLines || 1,
        }
    }

    onValueValidation = (storageValue: StorageValue): string | undefined =>
    {
        const illegal = UtilityValidate.getIllegalCharacters(storageValue.text || "", this.state.legalCharacters);

        if(illegal == undefined || illegal == "")
        {   return undefined;}
        else
        {   return "Please refrain from using the following illegal characters: " + illegal;}
    }

    onTextChanged = (text: string) => 
    {
        if(this.base)
        {   this.base.onValueChange({text: {$set: text}});}
    }

    getDialogContent = (storageValue: StorageValue, error: string | undefined) => 
    {
        return ( 
            <View>
                <TextInput autoFocus={true} style={styles.input} label={this.state.label} value={storageValue.text} onChangeText={this.onTextChanged} multiline={this.state.multiline} numberOfLines={this.state.numberOfLines}/>
                <InputError margin={true} error={error} />
            </View>
        );
    }

    render()
    {
        return (
            <AbstractPreferenceDialog ref={onBaseReference(this)} onInternalValueValidation={this.onValueValidation} getDialogContent={this.getDialogContent} {...this.props}/>
        );
    }
}  
