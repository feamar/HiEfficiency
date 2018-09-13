import React, {Children } from "react";
import {View} from "react-native";
import PropTypes from "prop-types";
import UtilityObject from "../utilities/UtilityObject";

export default class DatabaseProvider extends React.Component
{
    constructor (props)
    {
        super(props);

        this.state = {
            database: this.props.database
        }
    }

    static childContextTypes = {
        database: PropTypes.any.isRequired
    }

    getChildContext() {
        return {
            database: this.state.database
        }
    }

    render () {
        return Children.only(this.props.children)
    }
}