import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from './AbstractPreferenceDialog';
import SelectOption from '../../../dtos/options/SelectOption';
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

export interface DialogPreferenceMultiSelect_StorageValue
{
    selected: Array<SelectOption>
}

type StorageValue = DialogPreferenceMultiSelect_StorageValue;

type Props = AbstractPreferenceDialog_Props_Virtual<StorageValue> &
{
    options: Array<SelectOption>
}

interface State
{
    options: Array<SelectOption>
}

export default class DialogPreferenceMultiSelect extends React.Component<Props, State> implements Baseable<AbstractPreferenceDialog<StorageValue>>
{
    private _base: AbstractPreferenceDialog<StorageValue> | undefined;
    
    constructor(props: Props) 
    {
        super(props);

        this.state = 
        {
            options: this.props.options,
        }
    }

    public get base ()
    {   return this._base;}
    
    onCheckboxPress = (index: number) => () => 
    {
        if(this.base == undefined)
        {   return;}

        const sv = this.base.getCurrentStorageValue();
        if(sv == null)
        {   return;}

        const option = this.state.options[index];

        const i = sv.selected.indexOf(option);
        if(i > -1)
        {   this.base.onValueChange({selected: {$splice: [[i, 1]]}});}
        else
        {   this.base.onValueChange({selected: {$push: [option]}});}
    }

    getCheckboxFor = (item: SelectOption, index: number) => 
    {
        //Check whether the current value array contains the current index.
        var sv: StorageValue | null;
        if(this.base)
        {  sv = this.base.getCurrentStorageValue();}
        else
        {  sv = this.props.storageValue;}

        if(sv == null)
        {   return null;}

        var checked = sv.selected.indexOf(item) > -1; 

        return (
            <View style={styles.item} key={index}>
                <Text style={styles.title}>{item}</Text>
                <Checkbox style={styles.checkbox} checked={checked} onPress={this.onCheckboxPress(index)} />
            </View>
        );
    } 

    getDialogContent = () =>
    {
        return (
            <View style={{margin: 25}}>
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