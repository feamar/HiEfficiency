import React from "react";
import withStaticFields from "./WithStaticFields"
import AbstractHigherOrderComponent from './AbstractHigherOrderComponent';
import UtilityObject from "../utilities/UtilityObject";
import PropTypes from "prop-types";

export default WithDatabase = (WrappedComponent) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent
    {
        static contextTypes = {
            database: PropTypes.any.isRequired
        }

        constructor(props, context)
        {
            super(props, context);
        }

        render()
        {   return <WrappedComponent ref={instance => this.wrapped = instance} database={this.context.database} {...this.props} />}
    }

    return withStaticFields(WrappedComponent, hoc);
} 
