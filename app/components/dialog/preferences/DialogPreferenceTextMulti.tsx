import React from 'react';
import {View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from './AbstractPreferenceDialog';
import UtilityValidate from "../../../utilities/UtilityValidate";
import { Baseable, onBaseReference } from '../../../render_props/Baseable';
import InputError from '../../inputs/InputError';

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


export type DialogPreferenceTextMulti_StorageValue<> = {[index: string]: string}
type StorageValue = DialogPreferenceTextMulti_StorageValue;

type Props<Fields> = AbstractPreferenceDialog_Props_Virtual<StorageValue> &
{
    elements: Array<TextElement<Fields>>
}

interface State<Fields>
{
    elements: Array<TextElement<Fields>>
}

export default class DialogPreferenceTextMulti<Fields> extends React.Component<Props<Fields>, State<Fields>> implements Baseable<AbstractPreferenceDialog<StorageValue>>
{
    public base: AbstractPreferenceDialog<StorageValue> | undefined;

    constructor(props: Props<Fields>)
    {
        super(props);
        
        this.state = {
            elements: props.elements,
        }
    }

    onValueValidation = (storageValue: StorageValue) =>
    {
        var allIllegals = "";
        for(var outer = 0 ; outer < this.state.elements.length ; outer ++)
        {
            const element = this.state.elements[outer];
            const value = storageValue[element.field];
         
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

    onTextInputChanged = (field: string) => (value: string) =>
    {
        if(this.base)
        {   this.base.onValueChange({[field]: {$set: value}});}
    }

    getDialogContent = (storageValue: StorageValue, error: string | undefined) => 
    {
        return (
            <View style={{flex: 1}}> 
                
                {this.state.elements.map((element, index) => 
                {
                    return (
                        <View key={element.field} style={styles.element}>
                            <TextInput blurOnSubmit={false} autoFocus={index == 0} label={element.label} value={storageValue[element.field]} onChangeText={this.onTextInputChanged(element.field)} multiline={element.multiline} numberOfLines={element.numberOfLines} />
                        </View>
                    );
                })}
                <InputError error={error} />
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
    public field: string;
    public label: string;
    public multiline: boolean;
    public numberOfLines: number
    public legalCharacters: string;

    constructor(field: keyof Fields, label: string, required: boolean = false, multiline: boolean = false, numberOfLines: number = 1, legalCharacters: string = UtilityValidate.DEFAULT_LEGAL_CHARACTERS)
    {
        this.required = required;
        this.field = field.toString();
        this.label = label;
        this.multiline = multiline;
        this.numberOfLines = numberOfLines;
        this.legalCharacters = legalCharacters
    }
}