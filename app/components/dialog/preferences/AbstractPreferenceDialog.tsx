import React from 'react';
import { Button, Dialog } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractDialog, { AbstractDialog_Props_Virtual } from '../AbstractDialog';
import update, {Spec} from "immutability-helper";
import { Baseable, onBaseReference } from '../../../render_props/Baseable';

interface AbstractPreferenceDialog_Props_Sealed<StorageValue> 
{
    getDialogContent: () => JSX.Element,
    onInputError?: (error: string) => any,
    onInternalValueValidation?: (storageValue: StorageValue) => string | undefined
}

export type AbstractPreferenceDialog_Props_Virtual<StorageValue> = AbstractDialog_Props_Virtual & 
{
    storageValue: StorageValue | null,
    onSubmit: (storageValue: StorageValue | null) => any,
    required?: boolean,
    onValueValidation?: (storageValue: StorageValue) => string | undefined,
}

type Props<StorageValue> = AbstractPreferenceDialog_Props_Sealed<StorageValue> & AbstractPreferenceDialog_Props_Virtual<StorageValue>

interface State<StorageValue>
{
    storageValue: StorageValue | null,
    error?: string,
    required: boolean
}

export default class AbstractPreferenceDialog<StorageValue> extends React.Component<Props<StorageValue>, State<StorageValue>> implements Baseable<AbstractDialog>
{
    private mBase: AbstractDialog | undefined;

    constructor(props: Props<StorageValue>) 
    {
        super(props);

        this.state = 
        {
            storageValue: this.props.storageValue,
            error: undefined,
            required: this.props.required || false
        }
    }

    public get base (): AbstractDialog | undefined 
    {   return this.mBase;}

    getCurrentStorageValue = () : StorageValue | null =>
    {   return this.state.storageValue;}

    getCurrentError = () : string | undefined =>
    {   return this.state.error;}

    getOriginalStorageValue = (): StorageValue | null =>
    {   return this.props.storageValue;}

    getInputValidationError = (storageValue: StorageValue | null): string | undefined =>
    {
        if(this.state.required)
        {   
            if(storageValue == null)
            {   return "Please enter a value first."}
        }
        else if(storageValue == null || storageValue == undefined)
        {   return undefined;}
        
        if(this.props.onInternalValueValidation)
        {
            const error: string | undefined = this.props.onInternalValueValidation(storageValue);
            if(error !== undefined)
            {   return error;}
        }

        if(this.props.onValueValidation === undefined)
        {   return undefined;}

        return this.props.onValueValidation(storageValue);
    }

    getDialogActions = ()  =>
    { 
        return (
            <Dialog.Actions>  
                <Button color={Theme.colors.primary} onPress={this.onCancel}>Cancel</Button> 
                <Button color={Theme.colors.primary} onPress={this.onSave}>OK</Button>
            </Dialog.Actions>
        );
    }

    onBaseReference = (reference?: AbstractDialog) =>
    {
        if(reference)
        {
            if(reference.onCloseListeners.includes(this.onDialogClosed) == false)
            {   reference.onCloseListeners.push(this.onDialogClosed);}
        }
    }
    
    onSave = () =>
    {
        const error: string | undefined = this.getInputValidationError(this.state.storageValue);
        if(error !== undefined)
        {
            this.setState({error: error});

            if(this.props.onInputError)
            {   this.props.onInputError(error);}

            return;
        }

        if(this.props.onSubmit)
        {   this.props.onSubmit(this.state.storageValue);}

        this.setState({error: undefined});

        if(this.mBase)
        {   this.mBase.setVisible(false);}
    }

    onCancel = () =>
    {
        if(this.mBase)
        {   this.mBase.onDismiss();}
    }

    onDialogClosed = () =>
    {       setTimeout(() => this.setState({error: undefined, storageValue: this.getOriginalStorageValue()}), 500);}

    setStorageValue = (storageValue: StorageValue | null) =>
    {   this.setState({storageValue: storageValue});}

    onValueChange = (spec: Spec<StorageValue | null, never>): void =>
    {
        const newStorageValue = update(this.state.storageValue, spec);
        this.setStorageValue(newStorageValue);
    }

    render()
    {
        return (
            <AbstractDialog 
                ref={onBaseReference(this)}
                content={this.props.getDialogContent()} 
                actions={this.getDialogActions()} 
                {...this.props} />
        );
    }
}