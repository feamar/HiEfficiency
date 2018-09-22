import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_USER_JOINED_TEAM} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import UtilityTime from '../../../utilities/UtilityTime';

export const TIMEOUT_RESOLVE_NONE = 0;
export const TIMEOUT_RESOLVE_ROLL_BACK = 1;

export const SECTION_CONNECTING = "Connecting to remote database";
export const SECTION_WAITING_FOR_CONFIRMATION = "Waiting for confirmation";

const STATE_UNEXECUTED = 0;
const STATE_EXECUTED = 1;
const STATE_SHOWN = 2;
const STATE_FINISHED = 3;

export default class AbstractCrudOperation
{
    constructor(initialMessage)
    {
        this.initialMessage = initialMessage;
        this.state = STATE_UNEXECUTED;
    }

    execute = async (dialog) =>
    {
        if(this.state < STATE_UNEXECUTED)
        {   return;}

        this.state = STATE_EXECUTED;
        this.dialog = dialog;

        this.dialog.setMessage(this.initialMessage);
        this.dialog.onTimeoutListeners.push(this.onDialogTimeOut);
        this.dialog.onDismissListeners.push(this.onDialogDismissed);
        this.dialog.onCloseListeners.push(this.onDialogClosed);
        this.dialog.onOpenListeners.push(this.onDialogOpened);
        
        const isConnected = await NetInfo.isConnected.fetch();
        if(isConnected == false)
        {   this.dialog.setWarning("No internet connection detected, operation might not synchronize correctly.");}
        
        try
        {
            await this.perform(this.dialog);
            return this.successful;
        }
        catch(error)
        {
            this.onError(this.dialog, "Something went wrong during the execution of the operation. Please try again.", error);
            return false;
        }      
    }

    onDialogTimeOut = async (dialog, section) =>
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

    onDialogDismissed = (dialog) =>
    {
        //console.log("On Dialog Dismissed");
        if(this.state != STATE_FINISHED)
        {   this.onRollback(dialog);}

        if(this.onDialogDismissedListener)
        {   this.onDialogDismissedListener(dialog);}
    }

    onDialogClosed = (dialog) =>
    {
        if(this.onDialogClosedListener)
        {   this.onDialogClosedListener(dialog);}
    }

    onDialogOpened = (dialog) =>
    {
        if(this.onDialogOpenedListener)
        {   this.onDialogOpenedListener(dialog);}
    }

    sendUpdates = async (dialog, expectedReduxAction, closure) =>
    {
        return new Promise((resolve, reject) => 
        {
            const listener = (action) =>
            {
                if(action.type == expectedReduxAction)
                {
                    ReduxManager.Instance.removeListener(listener);
                    resolve();
                }
            }

            if(dialog)
            {   dialog.setSection(SECTION_WAITING_FOR_CONFIRMATION);}
            ReduxManager.Instance.registerListener(listener);

            const result = closure();
            resolve(result);
        });
    }

    setOnDialogDismissedListener = (listener) =>
    {   this.onDialogDismissedListener = listener;}

    setOnDialogClosedListener = (listener) =>
    {   this.onDialogClosedListener = listener;}

    setOnDialogOpenedListener = (listener) =>
    {   this.onDialogOpenedListener = listener;}

    onSuccess = (dialog, message) =>
    {
        console.log("Succes - Message: " + message)
        this.state = STATE_FINISHED;
        this.successful = true;

        ReduxManager.Instance.removeListener(this.onReduxAction);
        
        if(dialog)
        {
            dialog.setCancelable(true);
            dialog.setMessage(message);
        }
    }

    onError = async (dialog, message, error) =>
    {
        console.log("Error - Message: " + message);

        this.state = STATE_FINISHED;
        this.successful = false;

        //console.log("ON CRUD ERROR - " + message + " : " + UtilityObject.stringify(error) )
        ReduxManager.Instance.removeListener(this.onReduxAction);

        if(error)
        {   console.trace(error);}

        if(dialog)
        {
            dialog.setCancelable(true);
            dialog.setMessage(message);
            
            if(error)
            {   dialog.setWarning(error.toString());}
        }
        
        await this.onRollback(dialog);
    }

    attemptRollback = (attempt, maximum, closure) =>
    {
        if(attempt == maximum)
        {   return;}

        try
        {   closure();}
        catch(error)
        {   this.attemptRollback(attempt + 1, maximum, closure);}
    }
}