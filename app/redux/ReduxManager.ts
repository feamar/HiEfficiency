class SingletonEnforcer {}
const EnforcerInstance = new SingletonEnforcer();

export default class ReduxManager
{
    static Instance = new ReduxManager(EnforcerInstance);

    constructor(enforcer)
    {
        if(enforcer != EnforcerInstance)
        {   throw new Error("Cannot create additional runtime instances of the ReduxManager singleton.");}

        this.listeners = [];
    }

    registerListener = (listener) =>
    {
        if(this.listeners.indexOf(listener) >= 0)
        {   return false;}

        this.listeners.push(listener);
        return true;
    }

    removeListener = (listener) =>
    {   
        const index = this.listeners.indexOf(listener);
        if(index < 0)
        {   return false;}

        this.listeners.splice(index, 1);
        return true;
    }

    notifyListeners = (action) =>
    {
        for(var i = 0 ; i < this.listeners.length ; i ++)
        {
            const listener = this.listeners[i];
            if(listener && typeof listener === 'function')
            {   listener(action);}
        }
    }
}