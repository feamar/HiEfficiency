import React from "react";
import { View, StyleSheet, ViewStyle} from "react-native";
import InputDateTime from "./InputDateTime";
import { Text } from "react-native-paper";


const styles = StyleSheet.create({
    input:
    {
        paddingTop: 5,
        paddingBottom: 5,
        width: "50%",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#CECECE"
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
    disabled: boolean
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
        this.setState({start: timestamp});
        this.props.onRangeChange("start", timestamp);
    }
    
    onSelectedTo = (timestamp: Date) =>
    {
        this.setState({start: timestamp});
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
            <View style={this.getRootStyle()}>
                <InputDateTime style={styles.input} disabled={this.state.disabled} timestamp={this.state.start} mode="time" onSelected={this.onSelectedFrom}/>
                <Text> - </Text>
                <InputDateTime style={styles.input} disabled={this.state.disabled} timestamp={this.state.end} mode="time" onSelected={this.onSelectedTo}/>
            </View>
        );
    }
}