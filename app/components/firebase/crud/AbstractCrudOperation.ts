import {NetInfo} from 'react-native';
import DialogLoading from "../../dialogs/instances/DialogLoading";
import ReduxManager, { OnReduxStateChangedListener } from "../../../redux/ReduxManager";
import { OnDialogDismissListener, OnDialogCloseListener, OnDialogOpenListener } from '../../dialogs/AbstractDialog';
import AbstractReduxAction from '../../../redux/actions/AbstractReduxAction';

export const TIMEOUT_RESOLVE_NONE = 0;
export const TIMEOUT_RESOLVE_ROLL_BACK = 1;

export const SECTION_CONNECTING = "Connecting to remote database";
export const SECTION_WAITING_FOR_CONFIRMATION = "Waiting for confirmation";

export default abstract class AbstractCrudOperation
{
    private readonly initialMessage: string;
    private state: "Unexecuted" | "Executed" | "Shown" | "Finished";
    private successful?: boolean;
    private readonly reduxListeners: Array<OnReduxStateChangedListener>;

    public onDialogDismissListener?: OnDialogDismissListener;
    public onDialogCloseListener?: OnDialogCloseListener;
    public onDialogOpenListener?: OnDialogOpenListener;

    constructor(initialMessage: string)
    {
        this.initialMessage = initialMessage;
        this.state = "Unexecuted";
        this.reduxListeners = [];
    }

    public readonly execute = async (dialog: DialogLoading): Promise<boolean> =>
    {
        if(this.state != "Unexecuted")
        {   return Promise.reject(false);}

        this.state = "Executed";
        dialog.setMessage(this.initialMessage);
        dialog.onTimeoutListeners.push(this.onDialogTimeOut);
        dialog.onDismissListeners.push(this.onDialogDismissed);
        dialog.onCloseListeners.push(this.onDialogClosed);
        dialog.onOpenListeners.push(this.onDialogOpened);
        

        const isConnected = await NetInfo.isConnected.fetch();
        if(isConnected == false)
        {   dialog.setWarning("No internet connection detected, operation might not synchronize correctly.");}
        
        try
        {
            await this.perform(dialog);
            return this.successful || false;
        }
        catch(error)
        {
            this.onError(dialog, "Something went wrong during the execution of the operation. Please try again.", error);
            return false;
        }      
    }

    public readonly onDialogTimeOut = async (dialog: DialogLoading, section: string) =>
    {
        this.onError(dialog, "The operation has timed out. Please try again later.");

        switch(section)
        {
            case SECTION_WAITING_FOR_CONFIRMATION:
                await this.onRollback(dialog);
                break;

            case SECTION_CONNECTING:
                //Do nothing.
                break;
        }
    }

    public readonly onDialogDismissed = (dialog: DialogLoading) =>
    {
        //console.log("On Dialog Dismissed");
        if(this.state != "Finished")
        {   this.onRollback(dialog);}

        if(this.onDialogDismissListener)
        {   this.onDialogDismissListener(dialog);}
    }

    public readonly onDialogClosed = (dialog: DialogLoading) =>
    {
        if(this.onDialogCloseListener)
        {   this.onDialogCloseListener(dialog);}
    }

    public readonly onDialogOpened = (dialog: DialogLoading) =>
    {
        if(this.onDialogOpenListener)
        {   this.onDialogOpenListener(dialog);}
    }

    protected abstract onRollback (dialog: DialogLoading) : void;
    protected abstract perform(dialog: DialogLoading) : void;

    protected readonly sendUpdates = async <T> (dialog: DialogLoading, expectedReduxAction: string, closure: () => Promise<T>): Promise<T> =>
    {
        return new Promise<T>(async (resolve, _) => 
        {
            var result: T;
            const listener: OnReduxStateChangedListener = (action: AbstractReduxAction): void =>
            {
                if(action.type == expectedReduxAction)
                {
                    ReduxManager.Instance.removeListener(listener);
                    resolve(result);
                }
            }

            this.reduxListeners.push(listener);

            if(dialog)
            {   dialog.setSection(SECTION_WAITING_FOR_CONFIRMATION);}
            ReduxManager.Instance.registerListener(listener);

            result = await closure();
            return result;
        });
    }


    protected onSuccess = (dialog: DialogLoading, message: string) =>
    {
        console.log("Succes - Message: " + message)
        this.state = "Finished";
        this.successful = true;

        if(dialog)
        {
            dialog.setCancelable(true);
            dialog.setMessage(message);
        }

        this.reduxListeners.forEach((listener: OnReduxStateChangedListener) => 
        {   ReduxManager.Instance.removeListener(listener)});
    }

    protected onError = async (dialog: DialogLoading, message: string, error?: Error) =>
    {
        console.log("Error - Message: " + message);

        this.state = "Finished";
        this.successful = false;

        //console.log("ON CRUD ERROR - " + message + " : " + UtilityObject.stringify(error) )
        if(error)
        {   console.trace(error);}

        if(dialog)
        {
            dialog.setCancelable(true);
            dialog.setMessage(message);
            
            if(error)
            {   dialog.setWarning(error.toString());}
        }

        this.reduxListeners.forEach((listener: OnReduxStateChangedListener) => 
        {   ReduxManager.Instance.removeListener(listener)});

        await this.onRollback(dialog);
    }

    protected attemptRollback = <T> (attempt: number, maximum: number, closure: () => T) : T | undefined =>
    {
        if(attempt >= maximum)
        {   return undefined;}

        try
        {   return closure();}
        catch(error)
        {   return this.attemptRollback(attempt + 1, maximum, closure);}
    }
}