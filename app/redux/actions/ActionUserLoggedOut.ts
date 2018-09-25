import AbstractReduxAction from "./AbstractReduxAction";

export default class ActionUserLoggedOut extends AbstractReduxAction
{
    static readonly TYPE = "action_user_logged_out";

    constructor()
    {   super(ActionUserLoggedOut.TYPE);}
}