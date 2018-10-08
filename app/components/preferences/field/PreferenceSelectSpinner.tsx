import React from "react";
import SelectOption from '../../../dtos/options/SelectOption';
import { Baseable } from '../../../render_props/Baseable';
import { AbstractContainedPreference_Props_Virtual } from './AbstractContainedPreference';
import AbstractContainedPreference from "./AbstractContainedPreference";
import { View } from "react-native";
import { Dropdown } from 'react-native-material-dropdown';
import { AbstractPreferenceState } from "./AbstractPreference";
import update from "immutability-helper";

type StorageValue =
{
    selected: SelectOption
}

interface Props extends AbstractContainedPreference_Props_Virtual<StorageValue>
{
  options: Array<SelectOption>
}

interface State
{
}

export default class PreferenceSelectSpinner extends React.Component<Props, State> implements Baseable<AbstractContainedPreference<StorageValue>>
{
    private mBase?: AbstractContainedPreference<StorageValue>;
    public get base()
    {   return this.mBase;}

    constructor(props: Props)
    {
        super(props);
        
        this.state = 
        {   }
    }

    toDisplayValue = (storage: StorageValue) =>
    {   return storage.selected.value;}

    onValueSelected = (value: SelectOption) =>
    {
        if(this.mBase)
        {
            const abstractPreference = this.mBase.base;
            if(abstractPreference)
            {
                const updated = update(abstractPreference.state.storageValue, {selected: {$set: value}});
                abstractPreference.onValueChanged(updated);
            }
        }
    }

    getAdditionalDisplayContent = (state: AbstractPreferenceState<StorageValue>) =>
    {
        return (
            <View>
                <Dropdown data={this.props.options} onChangeText={this.onValueSelected} value={this.toDisplayValue(state.storageValue)} />
            </View>
        );
    }

    render ()
    {
        return <AbstractContainedPreference getAdditionalDisplayContent={this.getAdditionalDisplayContent} toDisplayValue={this.toDisplayValue} {...this.props} />
    }
}
