import React from 'react';

import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from '../../dialog/preferences/AbstractPreferenceDialog';
import AbstractDialogPreference, { AbstractDialogPreference_Props_Virtual } from './AbstractDialogPreference';
import DialogPreferenceSelect, { DialogPreferenceSelect_StorageValue as StorageValue} from '../../dialog/preferences/DialogPreferenceSelect';
import SelectOption from '../../../dtos/options/SelectOption';
import { Baseable } from '../../../render_props/Baseable';

interface Props extends AbstractDialogPreference_Props_Virtual<StorageValue>
{
  options: Array<SelectOption>
}

interface State
{
}

export default class PreferenceSelectList extends React.Component<Props, State> implements Baseable<AbstractDialogPreference<StorageValue>>
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
            <DialogPreferenceSelect {...props} {...this.props} ref={onBaseReference} />
        );
    }

    toDisplayValue = (storage: StorageValue) =>
    {   return storage.selected.value;}

    satisfiesRequired = (storageValue: StorageValue) =>
    {   return storageValue.selected != undefined;}

    render ()
    {
        return <AbstractDialogPreference  satisfiesRequired={this.satisfiesRequired} toDisplayValue={this.toDisplayValue} getDialogComponent={this.getDialogComponent} {...this.props} />
    }
}
