import FirebaseAdapter from "../FirebaseAdapter";
import update, { Spec } from "immutability-helper";
import AbstractCrudOperation from './AbstractCrudOperation';
import DocumentUser from '../../../dtos/firebase/firestore/documents/DocumentUser';
import DialogLoading from "../../dialogs/instances/DialogLoading";
import ActionUserDataChanged from "../../../redux/actions/user/ActionUserDataChanged";
import { RNFirebase } from "react-native-firebase";

export default class UserUpdate extends AbstractCrudOperation
{
    private readonly userId: string;
    private readonly oldUser: DocumentUser;
    private readonly updates: Spec<DocumentUser, never>;

    constructor(userId: string, oldUser: DocumentUser, updates: Spec<DocumentUser, never>)
    {
        super("Please be patient while we try to update the profile..");

        this.userId = userId;
        this.oldUser = oldUser;
        this.updates = updates;
    }

    onRollback = async (_: DialogLoading) =>
    {
        this.attemptRollback(0, 10, async () => 
        {   await FirebaseAdapter.getUsers().doc(this.userId).set(this.oldUser);});
    }

    perform = async (dialog: DialogLoading) => 
    {
        try 
        {
            const newUser: DocumentUser = update(this.oldUser, this.updates);

            const document: RNFirebase.firestore.DocumentReference = FirebaseAdapter.getUsers().doc(this.userId);
            const snapshot: RNFirebase.firestore.DocumentSnapshot = await document.get();

            if(dialog.isTimedOut())
            {   return;}

            await this.sendUpdates(dialog, ActionUserDataChanged.TYPE, async () => 
            {
                if(snapshot.exists)
                {   await document.update(newUser);}
                else
                {   await document.set(newUser);}
            });
           
            this.onSuccess(dialog, "Successfully updated the profile.");
        }
        catch(error)
        {   this.onError(dialog, "Profile could not be updated, please try again.", error);}
    }
}