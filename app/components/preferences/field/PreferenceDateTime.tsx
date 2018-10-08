import React from 'react';

import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from '../../dialog/preferences/AbstractPreferenceDialog';
import AbstractDialogPreference, { AbstractDialogPreference_Props_Virtual } from './AbstractDialogPreference';
import DialogPreferenceDateTime, { DialogPreferenceDateTime_StorageValue as StorageValue, DialogPreferenceDateTime_DateTimeMode as DateTimeMode} from '../../dialog/preferences/DialogPreferenceDateTime';
import UtilityTime from '../../../utilities/UtilityTime';
import { onBaseReference, Baseable } from '../../../render_props/Baseable';

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

export default class PreferenceDateTime extends React.Component<Props, State> implements Baseable<AbstractDialogPreference<StorageValue>>
{
    private mBase?: AbstractDialogPreference<StorageValue>;
    constructor(props: Props)
    {
        super(props);
        
        this.state = 
        {   }
    }

    get base () 
    {   return this.mBase;}

    getDialogComponent = (props: AbstractPreferenceDialog_Props_Virtual<StorageValue>, onBaseReference: (ref: Baseable<AbstractPreferenceDialog<StorageValue>> | null) => void) =>
    {
        return (
            <DialogPreferenceDateTime ref={onBaseReference} {...props} {...this.props} />
        );
    }

    toDisplayValue = (storage: StorageValue) =>
    {   return UtilityTime.dateToString(storage.timestamp, undefined);}

    render ()
    {
        return <AbstractDialogPreference ref={onBaseReference(this)} toDisplayValue={this.toDisplayValue} getDialogComponent={this.getDialogComponent} {...this.props} />
    }
}
