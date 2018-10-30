import {NetInfo} from 'react-native';
import ReduxManager, { OnReduxStateChangedListener } from "../../../redux/ReduxManager";
import { ConcreteDialogLoading } from '../../dialog/instances/DialogLoading';
import { AnyAction } from 'redux';
import AbstractDialog from '../../dialog/AbstractDialog';

export const TIMEOUT_RESOLVE_NONE = 0;
export const TIMEOUT_RESOLVE_ROLL_BACK = 1;

export const SECTION_CONNECTING = "Connecting to remote database";
export const SECTION_WAITING_FOR_CONFIRMATION = "Waiting for confirmation";

interface Messagable 
{   setMessage: (message: string) => boolean}

interface Sectionable 
{   setSection: (section: string) => boolean}

interface Warnable
{   setWarning: (warning: string) => boolean}

interface Cancelable
{   setCancelable: (cancelable: boolean) => boolean}

interface Timeoutable
{   isTimedOut: () => boolean}

interface Completable
{   setCompleted: () => void;}

export type OnCompleteListener = (successful: boolean) => void;
export type Updatable = Messagable & Sectionable & Warnable & Cancelable & Timeoutable & Completable;

export default abstract class AbstractCrudOperation
{
    private readonly initialMessage: string;
    private state: "Unexecuted" | "Executed" | "Finished";
    private successful?: boolean;
    private readonly reduxListeners: Array<OnReduxStateChangedListener>;
    public onCompleteListener?: OnCompleteListener;

    constructor(initialMessage: string)
    {
        this.initialMessage = initialMessage;
        this.state = "Unexecuted";
        this.reduxListeners = [];
    }

    public readonly execute = async (dialog: ConcreteDialogLoading): Promise<boolean> =>
    {
        if(this.state != "Unexecuted")
        {   return Promise.reject(false);}

        this.state = "Executed";
        dialog.setMessage(this.initialMessage);
        dialog.onTimeoutListeners.push(this.onDialogTimeout);

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

    public readonly onDialogDismiss = async (_dialog: AbstractDialog) =>
    {
        //if(this.successful == undefined)
        //{   this.onRollback(undefined);}
    }

    public readonly onDialogTimeout = async (dialog: ConcreteDialogLoading, section: string) =>
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

    protected abstract onRollback (updatable: Updatable) : void;
    protected abstract perform(updatable: Updatable) : void;

    protected readonly sendUpdates = <T> (updatable: Updatable, expectedReduxAction: string, closure: () => Promise<T>): Promise<T> =>
    {
        return new Promise<T>((resolve, _) => 
        {
            var result: T;
            const listener: OnReduxStateChangedListener = (action: AnyAction): void =>
            {
                if(action.type == expectedReduxAction)
                {
                    ReduxManager.Instance.removeListener(listener);
                    resolve(result);
                }
            }

            this.reduxListeners.push(listener);

            updatable.setSection(SECTION_WAITING_FOR_CONFIRMATION);
            ReduxManager.Instance.registerListener(listener);

            return closure();
        });
    }


    protected onSuccess = (updatable: Updatable, message: string) =>
    {
        console.log("Succes - Message: " + message)
        this.state = "Finished";
        this.successful = true;

        updatable.setCancelable(true);
        updatable.setMessage(message);
        updatable.setCompleted();

        this.reduxListeners.forEach((listener: OnReduxStateChangedListener) => 
        {   ReduxManager.Instance.removeListener(listener)});

        if(this.onCompleteListener)
        {   this.onCompleteListener(true);}
    }

    protected onError = async (updatable: Updatable, message: string, error?: Error) =>
    {
        console.log("Error - Message: " + message);

        this.state = "Finished";
        this.successful = false;

        //console.log("ON CRUD ERROR - " + message + " : " + UtilityObject.stringify(error) )
        if(error)
        {   console.trace(error);}

        updatable.setCancelable(true);
        updatable.setMessage(message);
        updatable.setCompleted();
        
        if(error)
        {   updatable.setWarning(error.toString());}

        this.reduxListeners.forEach((listener: OnReduxStateChangedListener) => 
        {   ReduxManager.Instance.removeListener(listener)});

        await this.onRollback(updatable);

        if(this.onCompleteListener)
        {   this.onCompleteListener(false);}
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