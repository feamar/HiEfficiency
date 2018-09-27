import withStaticFields from "./WithStaticFields"
import AbstractHigherOrderComponent from './AbstractHigherOrderComponent';
import PropTypes from "prop-types";
import React from "react";
import { DatabaseProviderContext } from "../providers/DatabaseProvider";
import FirestoreFacade from "../components/firebase/FirestoreFacade";


interface WithDatabaseProp
{
    database: FirestoreFacade;
}

export default <Props extends object> (WrappedComponent: React.ComponentClass<Props & WithDatabaseProp>) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent<Props & WithDatabaseProp>
    {
        static contextTypes = 
        {   database: PropTypes.object.isRequired}

        constructor(props: Props & WithDatabaseProp, context: DatabaseProviderContext)
        {   super(props, context);}

        render()
        {   return <WrappedComponent database={this.context.database} {...this.props} />}
    }

    return withStaticFields(WrappedComponent, hoc);
} 
