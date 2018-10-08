import React from 'react';
import {View} from 'react-native';
import { Text } from 'react-native-paper';
import AbstractPreference, { AbstractPreferencePropsVirtual, AbstractPreferenceState, AbstractPreferenceStyles } from "./AbstractPreference";
import { Baseable, onBaseReference } from '../../../render_props/Baseable';

export type AbstractContainedPreference_Props_Virtual<StorageValue> = AbstractPreferencePropsVirtual<StorageValue> & 
{

}

interface AbstractContainedPreference_Props_Sealed<StorageValue> 
{
    getAdditionalDisplayContent?: (state: AbstractPreferenceState<StorageValue>) => JSX.Element,
    toDisplayValue: (storage: StorageValue) => string
}

type Props<StorageValue> = AbstractContainedPreference_Props_Sealed<StorageValue> & AbstractContainedPreference_Props_Virtual<StorageValue>;

interface State
{

}

export default class AbstractContainedPreference<StorageValue> extends React.Component<Props<StorageValue>, State> implements Baseable<AbstractPreference<StorageValue>>
{
    private mBase?: AbstractPreference<StorageValue>;

    constructor(props: Props<StorageValue>)
    {
        super(props);
    }

    public get base ()
    {   return this.mBase;}

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