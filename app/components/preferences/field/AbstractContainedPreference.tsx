import React from 'react';
import {View} from 'react-native';
import { Text } from 'react-native-paper';
import AbstractPreference, { AbstractPreference_Props_Virtual, AbstractPreferenceState, AbstractPreferenceStyles } from "./AbstractPreference";
import { Baseable, onBaseReference } from '../../../render_props/Baseable';

export type AbstractContainedPreference_Props_Virtual<StorageValue> = AbstractPreference_Props_Virtual<StorageValue> & 
{

}

interface AbstractContainedPreference_Props_Sealed<StorageValue> 
{
    getAdditionalDisplayContent?: (state: AbstractPreferenceState<StorageValue>) => JSX.Element,
    toDisplayValue: (storage: StorageValue) => string,
    satisfiesRequired: (storageValue: StorageValue) => boolean
}

type Props<StorageValue> = AbstractContainedPreference_Props_Sealed<StorageValue> & AbstractContainedPreference_Props_Virtual<StorageValue>;

interface State
{

}

export default class AbstractContainedPreference<StorageValue> extends React.Component<Props<StorageValue>, State> implements Baseable<AbstractPreference<StorageValue>>
{
    public base: AbstractPreference<StorageValue> | undefined;

    constructor(props: Props<StorageValue>)
    {
        super(props);
    }

    getDisplayContent = (state: AbstractPreferenceState<StorageValue>) =>
    {  
        return (
            <View>
                <Text style={AbstractPreferenceStyles.title}>{this.props.title}</Text>
                {this.props.getAdditionalDisplayContent && this.props.getAdditionalDisplayContent(state)}
            </View>
        );
    }

    render()
    {
        return <AbstractPreference ref={onBaseReference(this)} {...this.props} toDisplayValue={this.props.toDisplayValue} getDisplayContent={this.getDisplayContent}  />
    }
} 