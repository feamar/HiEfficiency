import React from "react";
import SelectOption from '../../../dtos/options/SelectOption';
import { Baseable, onBaseReference } from '../../../render_props/Baseable';
import { AbstractContainedPreference_Props_Virtual } from './AbstractContainedPreference';
import AbstractContainedPreference from "./AbstractContainedPreference";
import { View } from "react-native";
import { Dropdown } from 'react-native-material-dropdown';
import { AbstractPreferenceState } from "./AbstractPreference";
import update from "immutability-helper";
import UtilityObject from "../../../utilities/UtilityObject";

export type PreferenceSelectSpinner_StorageValue =
{
    selected: SelectOption
}

type StorageValue = PreferenceSelectSpinner_StorageValue;

interface Props extends AbstractContainedPreference_Props_Virtual<StorageValue>
{
  options: Array<SelectOption>
}

interface State
{
}

export default class PreferenceSelectSpinner extends React.Component<Props, State> implements Baseable<AbstractContainedPreference<StorageValue>>
{
    public base: AbstractContainedPreference<StorageValue> | undefined;

    constructor(props: Props)
    {
        super(props);
        
        this.state = 
        {   }
    }

    toDisplayValue = (storage: StorageValue) =>
    {   return storage.selected.value;}

    onValueSelected = async (value: string) =>
    {
        const selected = this.props.options.find(e => e.value == value);
        if(selected == undefined) return;

        if(this.base)
        {
            const abstractPreference = this.base.base;
            if(abstractPreference)
            {
                const updated = update(abstractPreference.state.storageValue, {selected: {$set: selected}});
                abstractPreference.onValueChanged(updated);
            }
        }
    }

    getAdditionalDisplayContent = (state: AbstractPreferenceState<StorageValue>) =>
    {
        const value = state.storageValue == null ? "None selected" : this.toDisplayValue(state.storageValue);
        return (
            <View>
                <Dropdown data={this.props.options} onChangeText={this.onValueSelected} value={value} />
            </View>
        );
    }

    satisfiesRequired = (storageValue: StorageValue) =>
    {   return storageValue.selected != undefined;}

    render ()
    {
        return <AbstractContainedPreference satisfiesRequired={this.satisfiesRequired} ref={onBaseReference(this)} getAdditionalDisplayContent={this.getAdditionalDisplayContent} toDisplayValue={this.toDisplayValue} {...this.props} />
    }
}
