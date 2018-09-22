import React, {Component} from 'react';
import {View } from 'react-native';
import { TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractPreferenceDialog from './AbstractPreferenceDialog';
import PropTypes from 'prop-types';
import {Text} from "react-native-paper";
import UtilityValidate from "../../../utilities/UtilityValidate";
import UtilityObject from "../../../utilities/UtilityObject";
import update from "immutability-helper";

const styles = {
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
}

export default class DialogPreferenceTextMulti extends AbstractPreferenceDialog
{

    constructor(props)
    {
        super(props);
        
        this.state = {
            ...this.state,
            elements: props.elements,
            storageValue: props.storageValue || {}
        }

        console.log("STORAGE VALUE: " + UtilityObject.stringify(this.state.storageValue));
    }


    getOriginalStorageValue = () =>
    {   return this.props.storageValue || {};}


    onValueValidation = (storageValue) =>
    {
        var allIllegals = "";
        for(var outer = 0 ; outer < this.state.elements.length ; outer ++)
        {
            const element = this.state.elements[outer];
            const value = storageValue[element.field];
         
            console.log("HEREEHEHEHEHREHEHRHEHE: " + value + "    " + (value == "")  + " and " + (value == undefined) + " And is required: " + element.required);
            if(element.required && (value == undefined || value == ""))
            {   return "Please fill out all the required fields first.";}

            const illegal = UtilityValidate.getIllegalCharacters(storageValue[element.field], element.legalCharacters);
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

    onTextInputChanged = (field) => (value) =>
    {
        var newStorageValue = update(this.state.storageValue, {[field]: {$set: value}});
        this.onValueChange(newStorageValue);
    }

    getDialogContent = () => 
    {
        return (
            <View> 
                {this.state.elements.map((element, index) => 
                {
                    return (
                        <View key={element.field} style={styles.element}>
                            <TextInput autoFocus={index == 0} name="value" label={element.label} value={this.state.storageValue[element.field]} onChangeText={this.onTextInputChanged(element.field)} multiline={element.multiline} numberOfLines={element.numberOfLines} />
                        </View>
                    );
                })}

                {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
            </View>
        );
    }
}  

DialogPreferenceTextMulti.defaultProps = {
    elements: []
}

DialogPreferenceTextMulti.propTypes = {
    elements: PropTypes.array
}

export class TextElement 
{
    constructor(field, label, required, multiline, numberOfLines, legalCharacters)
    {
        this.required = required;
        this.field = field;
        this.label = label;
        this.multiline = multiline;
        this.numberOfLines = numberOfLines || 1;
        this.legalCharacters = legalCharacters || UtilityValidate.DEFAULT_LEGAL_CHARACTERS;
    }
}