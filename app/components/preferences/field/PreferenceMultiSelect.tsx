import React from 'react';

import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from '../../dialog/preferences/AbstractPreferenceDialog';
import AbstractDialogPreference, { AbstractDialogPreference_Props_Virtual } from './AbstractDialogPreference';
import DialogPreferenceMultiSelect, { DialogPreferenceMultiSelect_StorageValue as StorageValue } from '../../dialog/preferences/DialogPreferenceMultiSelect';
import SelectOption from '../../../dtos/options/SelectOption';
import { Baseable } from '../../../render_props/Baseable';

interface Props extends AbstractDialogPreference_Props_Virtual<StorageValue>
{
  options: Array<SelectOption>
}

interface State
{
}

export default class PreferenceMultiSelect extends React.Component<Props, State> implements Baseable<AbstractDialogPreference<StorageValue>>
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
            <DialogPreferenceMultiSelect {...props} {...this.props} ref={onBaseReference} />
        );
    }

    toDisplayValue = (storage: StorageValue) =>
    {   return storage.selected.map(selected => selected.value).join(", ");}


    satisfiesRequired = (storageValue: StorageValue) =>
    {   return storageValue.selected.length != 0;}

    render ()
    {
        return <AbstractDialogPreference  satisfiesRequired={this.satisfiesRequired} toDisplayValue={this.toDisplayValue} getDialogComponent={this.getDialogComponent} {...this.props} />
    }
}
