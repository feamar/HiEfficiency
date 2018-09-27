import React from "react";
import {Subtract} from "utility-types";

export type OnActionClickedListener<C, A> = (dialog: C | undefined, action: A) => void;

interface InjectedProps<A> 
{   onActionClicked: (action: A) => void;}

interface ExternalProps<C, A>
{   onActionClickListener?: (component: C | undefined, action: A) => void;}

//type HocProps<C, A, P extends InjectedProps<A>> = P & ExternalProps<C, A>;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

type HocProps<C, A, P extends InjectedProps<A>> = P & ExternalProps<C, A>;


export default <C, A, P extends InjectedProps<A>> (WrappedComponent: React.ComponentClass<P>) =>
{
    const hoc = class WithActions extends React.Component<HocProps<C, A, P>>
    {
        public readonly onActionClickedListeners: Array<OnActionClickedListener<C, A>> = [];
        private mWrapped: C | null;

        constructor(props: HocProps<C, A, P>)
        {
            super(props);
            this.mWrapped = null;

            if(props.onActionClickListener != undefined)
            {   this.onActionClickedListeners.push(props.onActionClickListener);}
        }

        public addOnActionClickedListener = (listener: OnActionClickedListener<C, A>) :  boolean =>
        {   
            const index = this.onActionClickedListeners.indexOf(listener);
            if(index >= 0)
            {   return false;}

            this.onActionClickedListeners.push(listener);
            return true;
        }

        public removeOnActionClickedListener = (listener: OnActionClickedListener<C, A>) : boolean =>
        {
            const index = this.onActionClickedListeners.indexOf(listener);
            if(index < 0)
            {   return false;}

            this.onActionClickedListeners.splice(index, 1);
            return true;
        }

        private onActionClicked = (action: A) =>
        {
            this.onActionClickedListeners.forEach(listener => 
            {   listener(this.wrapped, action);});
        }

        get wrapped () : C | undefined
        {
            if(this.mWrapped == null)
            {   return undefined;}

            if(typeof this.mWrapped === typeof WrappedComponent)
            {   return this.mWrapped as C;}

            throw new Error("This did not work, back to the drawing board.");
        }

        render()
        {
            return (
                <WrappedComponent ref={i => this.mWrapped = i} onActionClicked={this.onActionClicked} {...this.props} />
            );
        }
    }

    return hoc;
}
