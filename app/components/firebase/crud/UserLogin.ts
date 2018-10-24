import FirebaseAdapter from "../FirebaseAdapter";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import FirebaseManager from '../FirebaseManager';
import ActionUserLoggedIn from "../../../redux/actions/user/ActionUserLoggedIn";
import  { RNFirebase } from "react-native-firebase";
import AbstractFirestoreDocument from "../../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentUser from "../../../dtos/firebase/firestore/documents/DocumentUser";
import UtilityObject from "../../../utilities/UtilityObject";
import Migration_2018_10_11_WeekSchema from "../../../migrations/Migration_2018_10_11_WeekSchema";

export default class UserLogin extends AbstractCrudOperation
{
    private readonly email: string;
    private readonly password: string;
    private readonly dispatch: (action: ActionUserLoggedIn) => ActionUserLoggedIn;

    constructor(email: string, password: string, dispatch: (action: ActionUserLoggedIn) => ActionUserLoggedIn)
    {
        super("Please be patient while we try to login..");

        this.email = email;
        this.password = password;
        this.dispatch = dispatch;
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
            const credentials: RNFirebase.UserCredential = await auth.signInAndRetrieveDataWithEmailAndPassword(this.email, this.password);
            await new Migration_2018_10_11_WeekSchema(credentials.user.uid).perform();

            const snapshot = await FirebaseAdapter.getUsers().doc(credentials.user.uid).get();
            const document = DocumentUser.fromSnapshot(snapshot);

            this.onSuccess(updatable, "You have successfully logged in.");
            this.dispatch(new ActionUserLoggedIn(new AbstractFirestoreDocument<DocumentUser>(document!, credentials.user.uid)));
        }
        catch(error)
        {  
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