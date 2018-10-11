import React from 'react';

import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from '../../dialog/preferences/AbstractPreferenceDialog';
import DialogPreferenceDateTime, { DialogPreferenceDateTime_StorageValue as StorageValue} from '../../dialog/preferences/DialogPreferenceDateTime';
import UtilityTime from '../../../utilities/UtilityTime';
import { onBaseReference, Baseable } from '../../../render_props/Baseable';
import AbstractContainedPreference, { AbstractContainedPreference_Props_Virtual } from './AbstractContainedPreference';
import { AbstractPreferenceState, AbstractPreferenceStyles } from './AbstractPreference';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

type Props = AbstractContainedPreference_Props_Virtual<StorageValue> & 
{
    multiline?: boolean,
    numberOfLines?: number,
    label: string,
    mode: PreferenceDateTime_Mode
}

interface State
{
    pickerIsVisible: boolean
}

export type PreferenceDateTime_Mode = "date" | "time" | "datetime";

export default class PreferenceDateTime extends React.Component<Props, State> implements Baseable<AbstractContainedPreference<StorageValue>>
{
    public base: AbstractContainedPreference<StorageValue> | undefined;
    constructor(props: Props)
    {
        super(props);
        
        this.state = 
        {   
            pickerIsVisible: false
        }
    }

    getDialogComponent = (props: AbstractPreferenceDialog_Props_Virtual<StorageValue>, onBaseReference: (ref: Baseable<AbstractPreferenceDialog<StorageValue>> | null) => void) =>
    {
        return (
            <DialogPreferenceDateTime ref={onBaseReference} {...props} {...this.props} />
        );
    }

    toDisplayValue = (storage: StorageValue) =>
    {   
        if(storage.timestamp == undefined)
        {   return "";}
        
        return UtilityTime.dateToString(storage.timestamp, undefined);
    }

    onTimePickerConfirmed = (timestamp: Date) =>
    {
        if(this.base && this.base.base)
        {   this.base.base.onValueChanged({timestamp: timestamp});}

        this.setState({pickerIsVisible: false});
    }

    onTimePickerCanceled = () =>
    {   this.setState({pickerIsVisible: false});}

    onPreferencePress = () => 
    {   this.setState({pickerIsVisible: true});}

    getAdditionalDisplayContent = (state: AbstractPreferenceState<StorageValue>) =>
    {
        return (
            <View>
                {state.displayValue ? <Text style={AbstractPreferenceStyles.displayValue}>{state.displayValue}</Text> : <Text style={AbstractPreferenceStyles.hintValue}>{"Press to enter a date."}</Text>}
                <DateTimePicker datePickerModeAndroid="spinner" date={state.storageValue.timestamp || new Date()} onCancel={this.onTimePickerCanceled} mode={this.props.mode} isVisible={this.state.pickerIsVisible} onConfirm={this.onTimePickerConfirmed} />
            </View>
        );
    }

    render ()
    {
        return <AbstractContainedPreference  onPreferencePress={this.onPreferencePress} ref={onBaseReference(this)} toDisplayValue={this.toDisplayValue} getAdditionalDisplayContent={this.getAdditionalDisplayContent} {...this.props} />
    }
}
