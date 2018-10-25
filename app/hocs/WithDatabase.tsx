import withStaticFields from "./WithStaticFields"
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent, ConcreteRef } from './AbstractHigherOrderComponent';
import PropTypes from "prop-types";
import React from "react";
import { DatabaseProviderContext } from "../providers/DatabaseProvider";
import FirestoreFacade from "../components/firebase/FirestoreFacade";


export interface WithDatabaseProps
{
    database: FirestoreFacade;
}

type HocProps<B, P> = WithDatabaseProps & P & ConcreteRef<B>

export default <B extends ConcreteComponent, C extends ConcreteOrHigher<B, C, {}, P>, P extends WithDatabaseProps> (WrappedComponent: ConcreteOrHigherConstructor<B, C, {}, P>) =>
{
    const hoc = class WithDatabase extends AbstractHigherOrderComponent<B, C, {}, P, HocProps<B, P>>
    {
        static contextTypes = 
        {   database: PropTypes.object.isRequired}

        constructor(props: HocProps<B, P>, context: DatabaseProviderContext)
        {   super(props, context);}

        render()
        {   return <WrappedComponent ref={this.onReference} database={this.context.database} {...this.props} />}
    }

    return withStaticFields(WrappedComponent, hoc);
} 
