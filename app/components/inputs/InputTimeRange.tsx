import React from "react";
import { View, StyleSheet, ViewStyle} from "react-native";
import InputDateTime from "./InputDateTime";
import { Text } from "react-native-paper";
import InputError from "./InputError";


const styles = StyleSheet.create({
    input:
    {
        paddingTop: 5,
        paddingBottom: 5,
        width: "50%",
        alignItems: "center",
    },
    hyphen:
    {
        paddingTop: 8
    }
});

interface Props 
{
    start?: Date,
    end?: Date,
    onRangeChange: (component: "start" | "end", timestamp: Date) => void,
    disabled?: boolean
}

interface State
{
    start: Date,
    end: Date,
    disabled: boolean,
    error?: string
}

export default class InputTimeRange extends React.Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state = {
            start: this.props.start || new Date(),
            end: this.props.end || new Date(),
            disabled: this.props.disabled || false
        }
    }

    onSelectedFrom = (timestamp: Date) =>
    {
        if(timestamp > this.state.end)
        {   this.setState({ error: "The start time of a workday can not be after the end time."});}
        else
        {   this.setState({error: undefined});}

        this.setState({start: timestamp});
        this.props.onRangeChange("start", timestamp);
    }
    
    onSelectedTo = (timestamp: Date) =>
    {
        if(timestamp < this.state.start)
        {   this.setState({error: "The end time of a workday can not be before the start time."});}
        else
        {   this.setState({error: undefined});}

        this.setState({end: timestamp});
        this.props.onRangeChange("end", timestamp);
    }

    getRootStyle = () => 
    {
        var style: ViewStyle = 
        {
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%"
        };

        if (this.state.disabled) 
        {   style["opacity"] = 0.4;}

        return style;
    }

    render()
    {
        return (
            <View>
                <View style={this.getRootStyle()}>
                    <InputDateTime style={styles.input} disabled={this.state.disabled} timestamp={this.state.start} mode="time" onSelected={this.onSelectedFrom}/>
                    <Text style={styles.hyphen}> - </Text>
                    <InputDateTime style={styles.input} disabled={this.state.disabled} timestamp={this.state.end} mode="time" onSelected={this.onSelectedTo}/>
                </View>
                <InputError error={this.state.error} />
            </View>
        );
    }
}