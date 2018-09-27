import React, {Component} from "react";

export default class AbstractHigherOrderComponent<Props extends object> extends React.Component<Props>
{
    protected wrapped?: React.ComponentType<Props>;

    public getBaseComponent = () : Component | undefined =>
    {
        if(this.wrapped == undefined)
        {   return undefined;}

        if(this.wrapped instanceof AbstractHigherOrderComponent)
        {
            const base = this.wrapped.getBaseComponent();
            if(base == undefined)
            {   return this.wrapped;}
            else
            {   return base;}
        }

        return undefined;
    }

    callForEachListener = (methodName: string, ...args: Array<any>) =>
    {
        var listener = this.wrapped;
        var results: Array<any> = [];
        
        while(listener != undefined)
        {   

            listener
            if(listener[methodName] != undefined)
        {       results.push(listener[methodName](...args));}

            listener = listener.wrapped;
        }

        return results;
    }
}