import React from 'react';

import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from '../../dialog/preferences/AbstractPreferenceDialog';
import AbstractDialogPreference, { AbstractDialogPreference_Props_Virtual } from './AbstractDialogPreference';
import DialogPreferenceText, { DialogPreferenceText_StorageValue as StorageValue} from '../../dialog/preferences/DialogPreferenceText';
import { Baseable, onBaseReference } from '../../../render_props/Baseable';

interface Props extends AbstractDialogPreference_Props_Virtual<StorageValue>
{
    multiline?: boolean,
    numberOfLines?: number,
    label: string
}

interface State
{
}

export default class PreferenceText extends React.Component<Props, State> implements Baseable<AbstractDialogPreference<StorageValue>>
{
    private mBase?: AbstractDialogPreference<StorageValue>;
    public get base()
    {   return this.mBase;}

    constructor(props: Props)
    {
        super(props);
        
        this.state = 
        {   }
    }

    getDialogComponent = (props: AbstractPreferenceDialog_Props_Virtual<StorageValue>, onBaseReference: (ref: Baseable<AbstractPreferenceDialog<StorageValue>> | null) => void) =>
    {
        return (
            <DialogPreferenceText {...props} {...this.props} ref={onBaseReference} />
        );
    }

    toDisplayValue = (storage: StorageValue) =>
    {   return storage.text;}

    render ()
    {
        return <AbstractDialogPreference ref={onBaseReference(this)} toDisplayValue={this.toDisplayValue} getDialogComponent={this.getDialogComponent} {...this.props} />
    }
}
