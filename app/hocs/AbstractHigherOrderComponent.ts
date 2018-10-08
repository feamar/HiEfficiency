import React from "react";

export type ConcreteOrHigher<B, C extends ConcreteOrHigher<B, C, F, P>, F, P> = ConcreteComponent<P> & F | HigherComponent<B, C, F, P> & Partial<F>
export type ConcreteOrHigherConstructor<B, C extends ConcreteOrHigher<B, C, F, P>, F, P> = ConcreteComponentConstructor<F, P> | HigherComponentConstructor<B, C, F, P>

interface ConcreteComponentConstructor<F, P> extends React.ComponentClass<P>
{   new (props: P, context?: any): ConcreteComponent<P> & F}

interface HigherComponentConstructor<B, C extends ConcreteOrHigher<B, C, F, P>, F, P> extends React.ComponentClass<Partial<P>>
{
    new (props: Partial<P>, content?: any): HigherComponent<B, C, F, P> & Partial<F>
}

export interface ConcreteComponent<P = {}> extends React.Component<Partial<P>>
{   }

export interface HigherComponent<B, C extends ConcreteOrHigher<B, C, F, P>, F, P> extends AbstractHigherOrderComponent<B, C, F, P>//React.Component<Partial<P>>
{
    wrapped?: ConcreteOrHigher<B, C, F, P>
    forEachWrappedComponent: (closure: (component: ConcreteOrHigher<B, C, F, P>) => void) => boolean;
}

export interface ConcreteRef<B>
{   concreteRef?: (reference: B | undefined) => void}

//B : Base Component Type
//C : Wrapped Component Type
//P : Prop Type
//F : Required Functions Typ
//HP: HOC Prop Type
//HS: HOC State Type
export default class AbstractHigherOrderComponent<B, C extends ConcreteOrHigher<B, C, F, P>, F, P, HP = {}, HS = {}> extends React.Component<HP & ConcreteRef<B>, HS>
{
    wrapped?: ConcreteOrHigher<B, C, F, P>;

    protected onReference = (ref: ConcreteOrHigher<B, C, F, P> | null) =>
    {
        if(ref == null)
        {   this.wrapped = undefined;}
        else
        {   this.wrapped = ref;}

        if(this.props.concreteRef)
        {   this.props.concreteRef(this.concrete)}
    }

    get concrete (): B | undefined
    {
        if(this.wrapped == undefined)
        {   return undefined;}

        if(this.isHigherOrderComponent(this.wrapped))
        {   return this.wrapped.concrete;}
        else if(this.isConcrete(this.wrapped))
        {   return this.wrapped;}

        return undefined;
    }

    protected isHigherOrderComponent(obj: any) : obj is AbstractHigherOrderComponent<B, C, F, P>
    {   return obj.constructor.name == AbstractHigherOrderComponent.name;}

    protected isHigher (obj: any) : obj is HigherComponent<B, C, F, P>
    {   return obj.constructor.name == AbstractHigherOrderComponent.name;}

    protected isConcrete(obj: any) : obj is B
    {   return this.isHigherOrderComponent(obj) == false;}

    public forEachWrappedComponent = (closure: (component: ConcreteOrHigher<B, C, F, P>) => void): boolean => 
    {
        if(this.wrapped == undefined)
        {   return false;}

        if(this.isHigherOrderComponent(this.wrapped))
        {   
            closure(this.wrapped);
            this.wrapped.forEachWrappedComponent(closure);
        }

        if(this.isConcrete(this.wrapped))
        {   closure(this.wrapped);}

        return true;
    }
}