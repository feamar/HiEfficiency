import React from 'react';
import { View, StyleSheet } from 'react-native';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from './AbstractPreferenceDialog';
import SelectOption from '../../../dtos/options/SelectOption';
import {Text, Checkbox} from "react-native-paper";
import { Baseable, onBaseReference } from '../../../render_props/Baseable';

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        paddingTop: 3,
        paddingBottom: 3,
        justifyContent: "space-between"
    },
    title: {
        paddingTop: 9
    },
    checkbox: {}
});

export interface DialogPreferenceSelect_StorageValue
{
    selected: SelectOption 
}
type StorageValue = DialogPreferenceSelect_StorageValue;

type Props = AbstractPreferenceDialog_Props_Virtual<StorageValue> & 
{
    options: Array<SelectOption>
}

interface State
{
    options: Array<SelectOption>
}

export default class DialogMultiSelect extends React.Component<Props, State> implements Baseable<AbstractPreferenceDialog<StorageValue>>
{
    public base: AbstractPreferenceDialog<StorageValue> | undefined;

    constructor(props: Props)
     {
        super(props);

        this.state = 
        {
            options: this.props.options,
        }
    }

    onCheckboxPress = (index: number) => () => 
    {
        if(this.base)
        {
            const option = this.state.options[index];
            this.base.onValueChange({selected: {$set: option}});
        }
    }

    getCheckboxFor = (item: SelectOption, index: number) => 
    {
        var sv: StorageValue | null;
        if(this.base)
        {   sv = this.base.getCurrentStorageValue();}
        else
        {   sv = this.props.storageValue;}

        if(sv == null)
        {   return null;}

        //Check whether the current value array contains the current index.
        var status: "checked" | "unchecked" = sv.selected == item ? "checked" : "unchecked";

        return (
            <View style={styles.item} key={index}>
                <Text style={styles.title}>{item}</Text>
                <Checkbox status={status} onPress={this.onCheckboxPress(index)} />
            </View>
        );
    }

    getDialogContent = (_storageValue: StorageValue, _error: string | undefined) =>
    {
        return (
            <View style={{marginLeft: 25, marginRight: 25}}>
                {this.state.options.map((item, index) => {
                    return this.getCheckboxFor(item, index)
                })}
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