import React from "react";
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from "../../../hocs/AbstractHigherOrderComponent";

export type OnActionClickedListener<B extends ConcreteComponent, A> = (baseComponent: B | undefined, action: A) => void;

interface InjectedProps<A> 
{   onActionClicked: (action: A) => void;}

interface ExternalProps<B extends ConcreteComponent, A>
{   onActionClickListener?: OnActionClickedListener<B, A>;}

export type WithActionPropsInner<P, A> = P & InjectedProps<A>;
type WithActionPropsOuter<B extends ConcreteComponent, A, P> = P & ExternalProps<B, A>

export default <B extends ConcreteComponent, 
                C extends ConcreteOrHigher<B, C, {}, WithActionPropsInner<P, A>>, 
                A, 
                P> 
                (WrappedComponent: ConcreteOrHigherConstructor<B, C, {}, WithActionPropsInner<P, A>>) =>
{
    const hoc = class WithActions extends AbstractHigherOrderComponent<B, C, {}, WithActionPropsInner<P, A>, WithActionPropsOuter<B, A, P>> 
    {
        public readonly onActionClickedListeners: Array<OnActionClickedListener<B, A>>;

        constructor(props: WithActionPropsOuter<C, A, P>)
        {
            super(props);

            this.onActionClickedListeners = [];

            const presetListener: OnActionClickedListener<B, A> | undefined = this.props.onActionClickListener;
            if(presetListener)
            {   this.onActionClickedListeners.push(presetListener);}
        }

        private onActionClicked = (action: A) =>
        {
            this.onActionClickedListeners.forEach(listener => 
            {   
                if(this.wrapped != null)
                {   listener(this.concrete, action);}
            });
        }

        render()
        {
            let passthroughProps: Readonly<P> = this.props;
            let innerProps: Readonly<WithActionPropsInner<P, A>> = Object.assign({}, passthroughProps,{onActionClicked: this.onActionClicked});

            return (
                <WrappedComponent ref={this.onReference} {...innerProps} />
            );
        }
    }

    return hoc;
}