import React from 'react';
import {View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from './AbstractPreferenceDialog';
import UtilityValidate from "../../../utilities/UtilityValidate";
import InputError from '../../inputs/InputError';
import { Baseable, onBaseReference } from '../../../render_props/Baseable';

const styles = StyleSheet.create({
    error:{
        marginTop: 10,
        fontWeight: "bold",
        color: "red",
        opacity: 0.75,
        marginLeft: 25, 
        marginRight: 25
    },
    element: {
       marginLeft: 25, 
       marginRight: 25
    }
});


export type DialogPreferenceTextMulti_StorageValue<Fields> = Map<keyof Fields, string> 
type StorageValue<Fields> = DialogPreferenceTextMulti_StorageValue<Fields>;

type Props<Fields> = AbstractPreferenceDialog_Props_Virtual<StorageValue<Fields>> &
{
    elements: Array<TextElement<Fields>>
}

interface State<Fields>
{
    elements: Array<TextElement<Fields>>
}

export default class DialogPreferenceTextMulti<Fields> extends React.Component<Props<Fields>, State<Fields>> implements Baseable<AbstractPreferenceDialog<StorageValue<Fields>>>
{
    private _base: AbstractPreferenceDialog<StorageValue<Fields>> | undefined;

    constructor(props: Props<Fields>)
    {
        super(props);
        
        this.state = {
            elements: props.elements,
        }
    }

    get base ()
    {   return this._base;}

    onValueValidation = (storageValue: StorageValue<Fields>) =>
    {
        var allIllegals = "";
        for(var outer = 0 ; outer < this.state.elements.length ; outer ++)
        {
            const element = this.state.elements[outer];
            const value = storageValue.get(element.field);
         
            if(element.required && (value == undefined || value == ""))
            {   return "Please fill out all the required fields first.";}

            const illegal = UtilityValidate.getIllegalCharacters(value || "", element.legalCharacters);
            if(illegal != undefined)
            {
                for(var inner = 0 ; inner < illegal.length ; inner ++)
                {
                    const char = illegal.charAt(inner);
                    if(allIllegals.includes(char) == false)
                    {   allIllegals += char;}
                }
            }
        }

        if(allIllegals == undefined || allIllegals == "")
        {   return undefined;}
        else
        {   return "Please refrain from using the following illegal characters: " + allIllegals;}
    }

    onTextInputChanged = (field: keyof Fields) => (value: string) =>
    {
        if(this.base)
        {   this.base.onValueChange({$add: [[field, value]]});}
    }

    getErrorComponent = () =>
    {
        if(this._base == undefined)
        {   return null;}

        return <InputError error={this._base.getCurrentError()} />
    }

    getDialogContent = () => 
    {
        var storageValue: StorageValue<Fields>;
        if(this.base)
        {   storageValue = this.base.getCurrentStorageValue() || new Map<keyof Fields, string>();}
        else
        {   storageValue = this.props.storageValue || new Map<keyof Fields, string>();}

        return (
            <View> 
                {this.state.elements.map((element, index) => 
                {
                    return (
                        <View key={element.field.toString()} style={styles.element}>
                            <TextInput autoFocus={index == 0} name="value" label={element.label} value={storageValue.get(element.field)} onChangeText={this.onTextInputChanged(element.field)} multiline={element.multiline} numberOfLines={element.numberOfLines} />
                        </View>
                    );
                })}
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

export class TextElement<Fields>
{
    public required: boolean;
    public field: keyof Fields;
    public label: string;
    public multiline: boolean;
    public numberOfLines: number
    public legalCharacters: string;

    constructor(field: keyof Fields, label: string, required: boolean = false, multiline: boolean = false, numberOfLines: number = 1, legalCharacters: string = UtilityValidate.DEFAULT_LEGAL_CHARACTERS)
    {
        this.required = required;
        this.field = field;
        this.label = label;
        this.multiline = multiline;
        this.numberOfLines = numberOfLines;
        this.legalCharacters = legalCharacters
    }
}