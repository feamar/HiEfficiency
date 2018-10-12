import React from 'react';

import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from '../../dialog/preferences/AbstractPreferenceDialog';
import AbstractDialogPreference, { AbstractDialogPreference_Props_Virtual } from './AbstractDialogPreference';
import DialogPreferenceDateTime, { DialogPreferenceDateTime_StorageValue as StorageValue, DialogPreferenceDateTime_DateTimeMode as DateTimeMode} from '../../dialog/preferences/DialogPreferenceDateTime';
import UtilityTime from '../../../utilities/UtilityTime';
import { onBaseReference, Baseable } from '../../../render_props/Baseable';
import { View } from 'react-native';

type Props = AbstractDialogPreference_Props_Virtual<StorageValue> & 
{
    multiline?: boolean,
    numberOfLines?: number,
    label: string,
    mode: DateTimeMode
}

interface State
{
}

export default class PreferenceDateTimeSeparate extends React.Component<Props, State> implements Baseable<AbstractDialogPreference<StorageValue>>
{
    public base: AbstractDialogPreference<StorageValue> | undefined;
    constructor(props: Props)
    {
        super(props);
        
        this.state = 
        {   }
    }

    getDialogComponent = (props: AbstractPreferenceDialog_Props_Virtual<StorageValue>, onBaseReference: (ref: Baseable<AbstractPreferenceDialog<StorageValue>> | null) => void) =>
    {
        return (
            <View>
                <DialogPreferenceDateTime ref={onBaseReference} {...props} {...this.props} />
            </View>
        );
    }

    toDisplayValue = (storage: StorageValue) =>
    {   
        if(storage.timestamp == undefined)
        {   return "";}
        
        return UtilityTime.dateToString(storage.timestamp, undefined);
    }


    satisfiesRequired = (storageValue: StorageValue) =>
    {   return storageValue.timestamp != undefined;}

    render ()
    {
        return <AbstractDialogPreference ref={onBaseReference(this)}  satisfiesRequired={this.satisfiesRequired} toDisplayValue={this.toDisplayValue} getDialogComponent={this.getDialogComponent} {...this.props} />
    }
}
