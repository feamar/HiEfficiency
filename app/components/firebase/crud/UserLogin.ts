import FirebaseAdapter from "../FirebaseAdapter";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import FirebaseManager from '../FirebaseManager';

export default class UserLogin extends AbstractCrudOperation
{
    private readonly email: string;
    private readonly password: string;

    constructor(email: string, password: string)
    {
        super("Please be patient while we try to login..");

        this.email = email;
        this.password = password;
    }

    onRollback = async (_: Updatable) =>
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

    perform = async (updatable: Updatable) => 
    {
        try 
        {
            const auth = FirebaseAdapter.getAuth();
            await auth.signInAndRetrieveDataWithEmailAndPassword(this.email, this.password);
            this.onSuccess(updatable, "You have successfully logged in.");
        }
        catch(error)
        {  
            //console.log("On error!: " + UtilityObject.stringify(error));
            switch(error.code)
            {
                case "auth/invalid-email":
                    this.onError(updatable, "The e-mail address you have entered has an invalid syntax, please verify that you have not made any mistakes.");
                    break;

                case "auth/user-disabled":
                    this.onError(updatable, "This user account has been disabled. Please contact support for more information.");
                    break;

                case "auth/user-not-found":
                case "auth/wrong-password":
                    this.onError(updatable, "The e-mail address and password combination you have entered do not match, please try again.");
                    break;

                default:
                    this.onError(updatable, "Something went wrong while trying to log in, please try again.", error);
            }
        }
    }
}