import React from "react";
import { StyleSheet} from "react-native";
import {Text} from "react-native-paper";
import UtilityCompare from "../../utilities/UtilityCompare";

const styles = StyleSheet.create({
    error:
    {
        fontWeight: "bold",
        color: "red",
        opacity: 0.75
    }
});

interface Props
{
    error?: string
}

interface State
{
    error?: string
}

export default class InputError extends React.Component<Props, State>
{
    componentWillReceiveProps = (props: Props) =>
    {   this.setState({error: props.error});}

    shouldComponentUpdate = (nextProps: Props, nextState: State) =>
    {   return UtilityCompare.shallowEqual(this.props, nextProps) == false || UtilityCompare.shallowEqual(this.state, nextState) == false;}

    render()
    {
        if(this.state.error == undefined)
        {   return null;}

        return (<Text style={styles.error}>{this.state.error}</Text>)
    }
}