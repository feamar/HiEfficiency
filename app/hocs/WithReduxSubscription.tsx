import React from "react"; 
import AbstractHigherOrderComponent, { ConcreteComponent, ConcreteOrHigher, ConcreteOrHigherConstructor } from "./AbstractHigherOrderComponent";
import { ReduxState } from "../redux/ReduxState";
import WithStaticFields from "./WithStaticFields";
import { Store, Unsubscribe, Dispatch } from "redux";
import PropTypes from "prop-types";

type MapStateToProps<Result extends {}> = (state: ReduxState) => Result;
type MapDispatchToProps<Result extends {}> = (dispatch: Dispatch) => Result;

export default 
    <B extends ConcreteComponent, 
     C extends ConcreteOrHigher<B, C, {}, P>, 
     P, SP, DP>

    (mapStateToProps?: MapStateToProps<SP>, mapDispatchToProps?: MapDispatchToProps<DP>) => 
    (WrappedComponent: ConcreteOrHigherConstructor<B, C, {}, P>) =>
{
    const hoc = class WithReduxSubscription extends AbstractHigherOrderComponent<B, C, {}, P>
    {
        static contextTypes = {
            store: PropTypes.object.isRequired
        }

        private store: Store<ReduxState>;
        private unsubscriber?: Unsubscribe;

        constructor(props: {}, context?: any)
        {
            super(props);

            this.log("Constructor", "Start");
            this.store = context.store;
        }

        componentWillMount = () =>
        {
            this.log("componentWillMount", "Start");
            if(this.unsubscriber)
            {   this.unsubscriber();}

            this.unsubscriber = this.store.subscribe(this.onReduxStateChanged);
            this.log("componentWillMount", "End");
        }
        
        onReduxStateChanged = () =>
        {
            this.log("onReduxStateChanged", "Start");
            this.forceUpdate();
            this.log("onReduxStateChanged", "End");
        }

        componentWillUnmount = () =>
        {
            this.log("componentWillUnmount", "Start");
            if(this.unsubscriber)
            {
                this.log("componentWillUnmount", "If");
                this.unsubscriber();
            }
            this.log("componentWillUnmount", "End");
        }

        render()
        {   
            this.log("render", "Start");
            const state = this.store.getState();

            var mappedState: SP | undefined = undefined;
            var mappedDispatch: DP | undefined = undefined;
            
            if(mapStateToProps)
            {   mappedState = mapStateToProps(state);}

            if(mapDispatchToProps)
            {   mappedDispatch = mapDispatchToProps(this.store.dispatch);}
            
            return <WrappedComponent ref={this.onReference} {...this.props} {...mappedState} {...mappedDispatch} />
        }

        log = (_method: string, _message: string) =>
        {   
            //console.log("WithReduxSubscription - " + method + " - " + message);
        }
    }

    return WithStaticFields(WrappedComponent, hoc);
}