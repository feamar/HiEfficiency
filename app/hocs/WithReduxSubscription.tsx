import React from "react"; 
import AbstractHigherOrderComponent, { ConcreteComponent, ConcreteOrHigher, ConcreteOrHigherConstructor } from "./AbstractHigherOrderComponent";
import { ReduxState } from "../redux/ReduxState";
import WithStaticFields from "./WithStaticFields";
import { Store, Unsubscribe, Dispatch } from "redux";

type MapStateToProps<Result extends {}> = (state: ReduxState) => Result;
type MapDispatchToProps<Result extends {}> = (dispatch: Dispatch) => Result;

export default 
    <B extends ConcreteComponent, 
     C extends ConcreteOrHigher<B, C, {}, P>, 
     P, SP, DP>

    (mapStateToProps?: MapStateToProps<SP>, mapDispatchToProps?: MapDispatchToProps<DP>) => 
    (WrappedComponent: ConcreteOrHigherConstructor<B, C, {}, P>) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent<B, C, {}, P>
    {
        private store: Store<ReduxState>;
        private unsubscriber?: Unsubscribe;

        constructor(props: {}, context?: any)
        {
            super(props);

            this.store = context.store;
        }

        componentWillMount = () =>
        {
            if(this.unsubscriber)
            {   this.unsubscriber();}

            this.unsubscriber = this.store.subscribe(this.onReduxStateChanged);
        }
        
        onReduxStateChanged = () =>
        {   this.forceUpdate();}

        componentWillUnmount = () =>
        {
            if(this.unsubscriber)
            {   this.unsubscriber();}
        }

        render()
        {   
            const state = this.store.getState();

            var mappedState: SP | undefined = undefined;
            var mappedDispatch: DP | undefined = undefined;
            
            if(mapStateToProps)
            {   mappedState = mapStateToProps(state);}

            if(mapDispatchToProps)
            {   mappedDispatch = mapDispatchToProps(this.store.dispatch);}
            
            return <WrappedComponent ref={this.onReference} {...this.props} {...mappedState} {...mappedDispatch} />
        }
    }

    return WithStaticFields(WrappedComponent, hoc);
}