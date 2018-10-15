import React from "react";
import { TextStyle} from "react-native";
import {Text} from "react-native-paper";
import UtilityCompare from "../../utilities/UtilityCompare";

interface Props
{
    error?: string
    margin?: boolean
}

interface State
{
    error?: string
    margin: boolean
}

export default class InputError extends React.Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state = {
            error: props.error,
            margin: props.margin || false
        }
    }

    componentWillReceiveProps = (props: Props) =>
    {
        this.setState({error: props.error});
    }

    shouldComponentUpdate = (nextProps: Props, nextState: State) =>
    {   return UtilityCompare.shallowEqual(this.props, nextProps) == false || UtilityCompare.shallowEqual(this.state, nextState) == false;}

    getCombinedStyles = () =>
    {
        const error: TextStyle =
        {
            fontWeight: "bold",
            color: "red",
            opacity: 0.75
        }

        if(this.state.margin)
        {
            error.marginLeft = 25;
            error.marginRight = 25;
        }

        return error;
    }

    render()
    {
        if(this.state.error == undefined)
        {   return null;}

        return (<Text style={this.getCombinedStyles()}>{this.state.error}</Text>)
    }
}