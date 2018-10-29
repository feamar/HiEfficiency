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
    public base: AbstractDialogPreference<StorageValue> | undefined;

    constructor(props: Props)
    {
        super(props);
        
        this.state = 
        {   }
    }

    componentWillReceiveProps = (nextProps: Props) =>
    {
        if(nextProps.storageValue != this.props.storageValue)
        {   
            if(this.base && this.base.base)
            {   this.base.base.onValueChanged(nextProps.storageValue, false);}
        }
    }

    getDialogComponent = (props: AbstractPreferenceDialog_Props_Virtual<StorageValue>, onBaseReference: (ref: Baseable<AbstractPreferenceDialog<StorageValue>> | null) => void) =>
    {
        return (
            <DialogPreferenceText {...props} {...this.props} ref={onBaseReference} />
        );
    }

    toDisplayValue = (storage: StorageValue) =>
    {
        if(storage.text == undefined)
        {   return "";}
        
        return storage.text;
    }
    
    satisfiesRequired = (storageValue: StorageValue) =>
    {   
        return storageValue.text != undefined && storageValue.text != "";
    }

    render ()
    {
        return <AbstractDialogPreference satisfiesRequired={this.satisfiesRequired} ref={onBaseReference(this)} toDisplayValue={this.toDisplayValue} getDialogComponent={this.getDialogComponent} {...this.props} />
    }
}
