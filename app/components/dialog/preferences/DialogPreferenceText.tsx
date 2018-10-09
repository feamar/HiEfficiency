import React from 'react';
import {View} from 'react-native';
import { TextInput } from 'react-native-paper';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from './AbstractPreferenceDialog';
import InputError from '../../inputs/InputError';
import UtilityValidate from '../../../utilities/UtilityValidate';
import { Baseable, onBaseReference } from '../../../render_props/Baseable';

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
    numberOfLines: number
}


export default class DialogPreferenceText extends React.Component<Props, State> implements Baseable<AbstractPreferenceDialog<StorageValue>>
{
    private _base: AbstractPreferenceDialog<StorageValue> | undefined;

    constructor(props: Props)
    {
        super(props);

        this.state = {
            label: props.label,
            legalCharacters: props.legalCharacters || UtilityValidate.DEFAULT_LEGAL_CHARACTERS,
            multiline: props.multiline || false,
            numberOfLines: props.numberOfLines || 1
        }
    }

    get base ()
    {   return this._base;}

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

    getErrorComponent = () =>
    {
        if(this._base == undefined)
        {   return null;}

        return <InputError error={this._base.getCurrentError()} />
    }

    getDialogContent = () => 
    {
        const value = this.base ? this.base.getCurrentStorageValue() : this.props.storageValue;
        const text = value == null ? "" : value.text;

        return ( 
            <View style={{marginLeft: 25, marginRight: 25}}>
                <TextInput style={{flex: 1}} autoFocus={true} name="value" label={this.state.label} value={text} onChangeText={this.onTextChanged} multiline={this.state.multiline} numberOfLines={this.state.numberOfLines} />
                {this.getErrorComponent()}
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
