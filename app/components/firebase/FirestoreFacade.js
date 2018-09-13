class SingletonEnforcer {}
const EnforcerInstance = new SingletonEnforcer();


export default class FirestoreFacade
{
    constructor(enforcer)
    {
        if(enforcer != EnforcerInstance)
        {   throw new Error("Cannot create additional runtime instances of the FirestoreFacade singleton.");}

        this.state = {};
    }

       //Update user data
       //Update story data
       //Update team data
       //Update interruption data

       //Set user data
       //Set story data
       //Set team data
       //Set interruption data

       //Delete story
       //Delete team
       //Delete interruption

       //Get user data.
       //Get story data.
       //Get team data.
       //Get interruption data.

}