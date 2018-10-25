import React, {Children } from "react";
import PropTypes from "prop-types";
import FirestoreFacade from "../components/firebase/FirestoreFacade";

interface ProviderProps 
{
    database: FirestoreFacade;
}

interface ProviderState 
{
    database: FirestoreFacade;
}

export interface DatabaseProviderContext
{
    database: FirestoreFacade;
}

export default class DatabaseProvider extends React.Component<ProviderProps, ProviderState>
{
    constructor (props: ProviderProps)
    {
        super(props);

        this.state = {
            database: this.props.database
        }
    }

    static childContextTypes = {
        database: PropTypes.object.isRequired
    }

    getChildContext(): DatabaseProviderContext 
    {
        return {
            database: this.state.database
        }
    }

    render () {
        return Children.only(this.props.children)
    }
}