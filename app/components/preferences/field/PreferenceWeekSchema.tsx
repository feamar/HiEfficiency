import React from 'react';
import AbstractDialogPreference, { AbstractDialogPreference_Props_Virtual } from './AbstractDialogPreference';
import DialogPreferenceWeekSchema from '../../dialog/preferences/DialogPreferenceWeekSchema';
import EntitySchemaWeek from '../../../dtos/firebase/firestore/entities/EntitySchemaWeek';
import { Baseable, onBaseReference } from '../../../render_props/Baseable';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from '../../dialog/preferences/AbstractPreferenceDialog';

type Props = AbstractDialogPreference_Props_Virtual<EntitySchemaWeek> & 
{

}

type State = 
{

}

export default class PreferenceWeekSchema extends React.Component<Props, State> implements Baseable<AbstractDialogPreference<EntitySchemaWeek>>
{
    private mBase?: AbstractDialogPreference<EntitySchemaWeek>;
    public get base()
    {   return this.mBase;}

    constructor(props: Props)
    {   super(props);}

    toDisplayValue = (storageValue: EntitySchemaWeek) =>
    {   return "A " + storageValue.getTotalHours() + " hour workweek.";}

    getDialogComponent = (props: AbstractPreferenceDialog_Props_Virtual<EntitySchemaWeek>, onBaseReference: (ref: Baseable<AbstractPreferenceDialog<EntitySchemaWeek>> | null) => void) =>
    {
        return (
            <DialogPreferenceWeekSchema {...props} {...this.props} ref={onBaseReference} />
        );
    }

    render ()
    {
        return <AbstractDialogPreference ref={onBaseReference(this)} toDisplayValue={this.toDisplayValue} getDialogComponent={this.getDialogComponent} {...this.props} />
    }
} 
 