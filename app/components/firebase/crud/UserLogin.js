import {ToastAndroid, NetInfo} from 'react-native';
import FirebaseAdapter from "../FirebaseAdapter";
import DialogLoading from "../../dialogs/instances/DialogLoading";
import update from "immutability-helper";
import ReduxManager from "../../../redux/ReduxManager";
import React from "react";
import UtilityAsync from '../../../utilities/UtilityAsync';
import {ACTION_TYPE_USER_LEFT_TEAM, ACTION_TYPE_USER_DATA_CHANGED} from "../../../redux/reducers/ReducerUser";
import UtilityObject from '../../../utilities/UtilityObject';
import AbstractCrudOperation, { SECTION_CONNECTING, SECTION_CONFIRMING, TIMEOUT_RESOLVE_NONE, TIMEOUT_RESOLVE_ROLL_BACK } from './AbstractCrudOperation';
import FirebaseManager from '../FirebaseManager';

export default class UserLogin extends AbstractCrudOperation
{
    constructor(email, password)
    {
        super("Please be patient while we try to login..");

        this.email = email;
        this.password = password;
    }

    onRollback = async (dialog) =>
    {
        FirebaseManager.Instance.loginHasBeenCanceled = true;
        this.attemptRollback(0, 10, async () => 
        {   
            try 
            {   await FirebaseAdapter.logout();}
            catch(error)
            {   }
        });
        FirebaseManager.Instance.loginHasBeenCanceled = false;
    }

    perform = async (dialog) => 
    {
        try 
        {
            const auth = FirebaseAdapter.getAuth();
            await auth.signInAndRetrieveDataWithEmailAndPassword(this.email, this.password);
            this.onSuccess(dialog, "You have successfully logged in.");
        }
        catch(error)
        {  
            console.log("On error!: " + UtilityObject.stringify(error));
            switch(error.code)
            {
                case "auth/invalid-email":
                    this.onError(dialog, "The e-mail address you have entered has an invalid syntax, please verify that you have not made any mistakes.");
                    break;

                case "auth/user-disabled":
                    this.onError(dialog, "This user account has been disabled. Please contact support for more information.");
                    break;

                case "auth/user-not-found":
                case "auth/wrong-password":
                    this.onError(dialog, "The e-mail address and password combination you have entered do not match, please try again.");
                    break;

                default:
                    this.onError(dialog, "Something went wrong while trying to log in, please try again.", error);
            }
        }
    }
}