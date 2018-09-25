import AbstractReduxAction from "./actions/AbstractReduxAction";

class SingletonEnforcer {}
const EnforcerInstance = new SingletonEnforcer();

type OnReduxStateChangedListener = (action: AbstractReduxAction) => void;

export default class ReduxManager
{
    static Instance = new ReduxManager(EnforcerInstance);

    listeners: OnReduxStateChangedListener[];

    constructor(enforcer: SingletonEnforcer)
    {
        if(enforcer != EnforcerInstance)
        {   throw new Error("Cannot create additional runtime instances of the ReduxManager singleton.");}

        this.listeners = [];
    }

    registerListener = (listener: OnReduxStateChangedListener) =>
    {
        if(this.listeners.indexOf(listener) >= 0)
        {   return false;}

        this.listeners.push(listener);
        return true;
    }

    removeListener = (listener: OnReduxStateChangedListener) =>
    {   
        const index: number = this.listeners.indexOf(listener);
        if(index < 0)
        {   return false;}

        this.listeners.splice(index, 1);
        return true;
    }

    notifyListeners = (action: AbstractReduxAction) =>
    {
        for(var i = 0 ; i < this.listeners.length ; i ++)
        {
            const listener: OnReduxStateChangedListener = this.listeners[i];
            if(listener && typeof listener === 'function')
            {   listener(action);}
        }
    }
}