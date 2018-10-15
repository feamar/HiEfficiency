import FirebaseAdapter from "../FirebaseAdapter";
import AbstractCrudOperation, { Updatable } from './AbstractCrudOperation';
import UtilityObject from "../../../utilities/UtilityObject";
import EntitySchemaWeek from "../../../dtos/firebase/firestore/entities/EntitySchemaWeek";

export default class UserRegister extends AbstractCrudOperation
{
    private readonly email: string;
    private readonly password: string;

    constructor(email: string, password: string)
    {
        super("Please be patient while we try to register your account..");

        this.email = email;
        this.password = password;
    }

    onRollback = async (_: Updatable) =>
    {
        //TODO: Figure out how to rollback a register. Do we just delete the (potentially) created account? 
        //What about the verification e-mail that was sent?
    }

    perform = async (updatable: Updatable) => 
    {
        try 
        {
            const auth = FirebaseAdapter.getAuth();
            const credentials = await auth.createUserAndRetrieveDataWithEmailAndPassword(this.email, this.password);

            credentials.user.sendEmailVerification();

            const user = {
                name: this.email,
                teams: [],
                weekSchema: EntitySchemaWeek.default()
            };

            console.log("SETTING USER: " + UtilityObject.stringify(user));

            await FirebaseAdapter.getUsers().doc(credentials.user.uid).set(user);

            this.onSuccess(updatable, "You have successfully registered your account.");
        }
        catch(error)
        {  
            //console.log("On error!: " + UtilityObject.stringify(error));
            switch(error.code)
            {
                case "auth/email-already-in-use":
                    this.onError(updatable, "The e-mail address you have entered is unavailable, please try again.");
                    break;

                case "auth/invalid-email":
                    this.onError(updatable, "The e-mail address you have entered has an invalid syntax, please verify that you have not made any mistakes.");
                    break;

                case "auth/weak-password":
                    this.onError(updatable, "The strength of the password is too weak, please try again.");
                    //TODO: Display password strength requirements?
                    break;

                default:
                    this.onError(updatable, "Something went wrong while trying to log in, please try again.", error);
            }
        }
    }
}