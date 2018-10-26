import React from 'react';
import { Button, Dialog } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractDialog, { AbstractDialog_Props_Virtual } from '../AbstractDialog';
import update, {Spec} from "immutability-helper";
import { Baseable, onBaseReference } from '../../../render_props/Baseable';
import UtilityObject from '../../../utilities/UtilityObject';
 
interface AbstractPreferenceDialog_Props_Sealed<StorageValue> 
{
    getDialogContent: (storageValue: StorageValue, currentError: string | undefined) => JSX.Element,
    onInputError?: (error: string) => any,
    onInternalValueValidation?: (storageValue: StorageValue) => string | undefined
}

export type AbstractPreferenceDialog_Props_Virtual<StorageValue> = AbstractDialog_Props_Virtual & 
{
    storageValue: StorageValue,
    onSubmit: (storageValue: StorageValue) => Promise<boolean> | boolean | undefined,
    required?: boolean,
    onValueValidation?: (storageValue: StorageValue) => string | undefined,
}

type Props<StorageValue> = AbstractPreferenceDialog_Props_Sealed<StorageValue> & AbstractPreferenceDialog_Props_Virtual<StorageValue> & 
{
}

interface State<StorageValue>
{
    storageValue: StorageValue,
    error?: string,
    required: boolean
}

export default class AbstractPreferenceDialog<StorageValue extends object> extends React.Component<Props<StorageValue>, State<StorageValue>> implements Baseable<AbstractDialog>
{
    public base: AbstractDialog | undefined;
    private inputBackup?: StorageValue;
    private hash: number;

    constructor(props: Props<StorageValue>) 
    {
        super(props);

        this.hash = Math.floor(Math.random() * 100);
        this.state = 
        {
            storageValue: this.props.storageValue,
            error: undefined,
            required: this.props.required || false
        }
    }

    componentWillMount = () =>
    {
        if(this.inputBackup)
        {   this.setStorageValue(this.inputBackup);}
    }

    componentWillReceiveProps = (props: Props<StorageValue>) =>
    {
        if(props.storageValue != this.props.storageValue)
        {   this.setState({storageValue: props.storageValue || this.state.storageValue});}

        if(props.required != this.props.required)
        {   this.setState({required: props.required || this.state.required});}
    }

    getCurrentStorageValue = () : StorageValue | null =>
    {   return this.state.storageValue;}

    getCurrentError = () : string | undefined =>
    {   return this.state.error;}

    getOriginalStorageValue = (): StorageValue | null =>
    {
        return this.inputBackup || this.props.storageValue;
    }

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

        if(this.props.onValueValidation == undefined)
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

            if(reference.onDismissListeners.includes(this.onDialogClosed) == false)
            {   reference.onDismissListeners.push(this.onDialogDismissed);}
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
        {
            const result = this.props.onSubmit(this.state.storageValue);

            if(result != undefined)
            {
                if(result instanceof Promise)
                {
                    result.then(successful => 
                    {
                        if(successful == false)
                        {   this.inputBackup = this.state.storageValue;}   
                    });
                }
                else
                {
                    if(result == false)
                    {   this.inputBackup = this.state.storageValue;}
                }
            }
        }

        this.setState({error: undefined});

        if(this.base)
        {   this.base.setVisible(false);}
    }

    onCancel = () =>
    {
        if(this.base)
        {   this.base.onDismiss();}

        this.inputBackup = undefined;
    }

    onDialogClosed = () =>
    {       
        console.log(this.hash + " - onDialogClosed: " + UtilityObject.stringify(this.state.storageValue));
        setTimeout(() => this.setState({error: undefined, storageValue: this.getOriginalStorageValue() || {} as StorageValue}), 500);
    }

    onDialogDismissed = () =>
    {
        console.log(this.hash + " - onDialogDismissed: " + UtilityObject.stringify(this.state.storageValue));
        this.inputBackup = this.state.storageValue;
    }

    setStorageValue = (storageValue: StorageValue) =>
    {
        console.log(this.hash + " - setStorageValue: " + UtilityObject.stringify(storageValue));
        this.setState({storageValue: storageValue});
    }

    onValueChange = (spec: Spec<StorageValue, never>): void =>
    {
        const newStorageValue = update(this.state.storageValue, spec);
        this.setStorageValue(newStorageValue);
    }

    render()
    {
        return (
            <AbstractDialog 
                ref={onBaseReference(this)}
                content={() => this.props.getDialogContent(this.state.storageValue, this.state.error)} 
                actions={this.getDialogActions} 
                {...this.props} />
        );
    }
}