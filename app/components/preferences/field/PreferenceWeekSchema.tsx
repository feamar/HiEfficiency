import React from 'react';
import AbstractDialogPreference, { AbstractDialogPreference_Props_Virtual } from './AbstractDialogPreference';
import DialogPreferenceWeekSchema from '../../dialog/preferences/DialogPreferenceWeekSchema';
import EntitySchemaWeek from '../../../dtos/firebase/firestore/entities/EntitySchemaWeek';
import { Baseable, onBaseReference } from '../../../render_props/Baseable';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from '../../dialog/preferences/AbstractPreferenceDialog';
import UtilityObject from '../../../utilities/UtilityObject';

type Props = AbstractDialogPreference_Props_Virtual<EntitySchemaWeek> & 
{

}

type State = 
{

}

export default class PreferenceWeekSchema extends React.Component<Props, State> implements Baseable<AbstractDialogPreference<EntitySchemaWeek>>
{
    public base: AbstractDialogPreference<EntitySchemaWeek> | undefined;

    constructor(props: Props)
    {   super(props);}

    toDisplayValue = (storageValue: EntitySchemaWeek) =>
    {  
        console.log("toDisplayValue: " + UtilityObject.stringify(storageValue));    
        return "A " + storageValue.getTotalHours() + " hour workweek.";
    }

    getDialogComponent = (props: AbstractPreferenceDialog_Props_Virtual<EntitySchemaWeek>, onBaseReference: (ref: Baseable<AbstractPreferenceDialog<EntitySchemaWeek>> | null) => void) =>
    {
        return (
            <DialogPreferenceWeekSchema {...props} {...this.props} ref={onBaseReference} />
        );
    }

    satisfiesRequired = (storageValue: EntitySchemaWeek) =>
    {   return storageValue != undefined;}

    render ()
    {
        return <AbstractDialogPreference satisfiesRequired={this.satisfiesRequired} ref={onBaseReference(this)} toDisplayValue={this.toDisplayValue} getDialogComponent={this.getDialogComponent} {...this.props} />
    }
} 
 