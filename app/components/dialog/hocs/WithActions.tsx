import React from "react";
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from "../../../hocs/AbstractHigherOrderComponent";

export type OnActionClickedListener<B extends ConcreteComponent, A> = (baseComponent: B | undefined, action: A) => void;

interface InjectedProps<B extends ConcreteComponent, A> 
{
    onActionClicked: (action: A) => void,
    addOnActionClickedListener: (listener: OnActionClickedListener<B, A>) => boolean
    removeOnActionClickedListener: (listener: OnActionClickedListener<B, A>) => boolean
}

interface ExternalProps<B extends ConcreteComponent, A>
{   onActionClickListener?: OnActionClickedListener<B, A>;}

export type WithActionPropsInner<B extends ConcreteComponent, P, A> = P & InjectedProps<B, A>;
type WithActionPropsOuter<B extends ConcreteComponent, A, P> = P & ExternalProps<B, A>

export default <B extends ConcreteComponent, 
                C extends ConcreteOrHigher<B, C, {}, WithActionPropsInner<B, P, A>>, 
                A, 
                P> 
                (WrappedComponent: ConcreteOrHigherConstructor<B, C, {}, WithActionPropsInner<B, P, A>>) =>
{
    const hoc = class WithActions extends AbstractHigherOrderComponent<B, C, {}, WithActionPropsInner<B, P, A>, WithActionPropsOuter<B, A, P>> 
    {
        private onActionClickedListeners: Array<OnActionClickedListener<B, A>>;

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
                {
                    listener(this.concrete, action);
                }
            });
        }

        addOnActionClickedListener = (listener: OnActionClickedListener<B, A>) =>
        {
            if(this.onActionClickedListeners.includes(listener))
            {   this.removeOnActionClickedListener(listener);}

            this.onActionClickedListeners.push(listener);
            return true;
        }

        removeOnActionClickedListener = (listener: OnActionClickedListener<B, A>) =>
        {
            const index = this.onActionClickedListeners.indexOf(listener);
            if(index < 0)
            {   return false;}

            this.onActionClickedListeners = this.onActionClickedListeners.splice(index, 1);
            return true;
        }

        render()
        {
            let passthroughProps: Readonly<P> = this.props;
            let innerProps: Readonly<WithActionPropsInner<B, P, A>> = Object.assign({}, passthroughProps, 
            {
                onActionClicked: this.onActionClicked, 
                addOnActionClickedListener: this.addOnActionClickedListener,
                removeOnActionClickedListener: this.removeOnActionClickedListener
            });

            return (
                <WrappedComponent ref={this.onReference} {...innerProps} />
            );
        }
    }

    return hoc;
}