import React, {Component} from "react";
import UtilityObject from "../utilities/UtilityObject";

export default class AbstractHigherOrderComponent extends Component
{
    getBaseComponent = () =>
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

    callForEachListener = (methodName, ...args) =>
    {
        var listener = this.wrapped;
        var results = [];
        
        while(listener != undefined)
        {   
            if(listener[methodName] != undefined)
        {       results.push(listener[methodName](...args));}

            listener = listener.wrapped;
        }

        return results;
    }
}