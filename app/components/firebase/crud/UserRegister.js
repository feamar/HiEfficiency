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
import ScreenProfile from "../../screens/ScreenProfile";

export default class UserRegister extends AbstractCrudOperation
{
    constructor(email, password)
    {
        super("Please be patient while we try to register your account..");

        this.email = email;
        this.password = password;
    }

    onRollback = async (dialog) =>
    {
        //TODO: Figure out how to rollback a register. Do we just delete the (potentially) created account? 
        //What about the verification e-mail that was sent?
    }

    perform = async (dialog) => 
    {
        try 
        {
            const auth = FirebaseAdapter.getAuth();
            const credentials = await auth.createUserAndRetrieveDataWithEmailAndPassword(this.email, this.password);

            credentials.user.sendEmailVerification();

            const user = {
                name: this.email,
                teams: [],
                weekSchema: ScreenProfile.getDefaultSchema()
            };

            await FirebaseAdapter.getUsers().doc(credentials.user.uid).set(user);

            this.onSuccess(dialog, "You have successfully registered your account.");
        }
        catch(error)
        {  
            //console.log("On error!: " + UtilityObject.stringify(error));
            switch(error.code)
            {
                case "auth/email-already-in-use":
                    this.onError(dialog, "The e-mail address you have entered is unavailable, please try again.");
                    break;

                case "auth/invalid-email":
                    this.onError(dialog, "The e-mail address you have entered has an invalid syntax, please verify that you have not made any mistakes.");
                    break;

                case "auth/weak-password":
                    this.onError(dialog, "The strength of the password is too weak, please try again.");
                    //TODO: Display password strength requirements?
                    break;

                default:
                    this.onError(dialog, "Something went wrong while trying to log in, please try again.", error);
            }
        }
    }
}