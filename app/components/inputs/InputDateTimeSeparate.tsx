import React, {Component} from "react";
import {View, StyleSheet, RegisteredStyle, ViewStyle, TextStyle, ImageStyle} from "react-native";
import InputDateTime from "./InputDateTime";

const styles = StyleSheet.create({
   wrapper:{
    display: "flex",
    flexDirection: "row"
   },
    input_date:
    {
        flex: 1,
        marginRight: 5
    },
    input_time:
    {
        flex: 1,
        marginLeft: 5
    }
});

interface Props
{
    style?: RegisteredStyle<ViewStyle | TextStyle | ImageStyle>,
    timestamp: Date,
    onSelected: (timestamp: Date) => void,
    disabled?: boolean
}

interface State
{
    disabled: boolean,
    time: Date,
    date: Date,
    timeComponent: number,
    dateComponent: number
}

export default class InputDateTimeSeparate extends Component<Props, State>
{
    static defaultProps: Partial<Props> = 
    {
        timestamp: new Date(),
        disabled: false
    }

    constructor(props: Props)
    {
        super(props);

        this.state = {
            disabled: this.props.disabled!,
            time: this.props.timestamp,
            timeComponent: this.getTimeComponentFrom(this.props.timestamp),
            date: this.props.timestamp,
            dateComponent: this.getDateComponentFrom(this.props.timestamp)
        }
    }

    onDateSelected = (timestamp: Date) =>
    {
        const dateComponent = this.getDateComponentFrom(timestamp);
        this.setState({date: timestamp, dateComponent: dateComponent}, () => 
        {
            if(this.props.onSelected)
            {   this.props.onSelected(new Date(this.state.dateComponent + this.state.timeComponent))};
        });
    }

    onTimeSelected = (timestamp: Date) => 
    {
        const timeComponent = this.getTimeComponentFrom(timestamp);

        this.setState({time: timestamp, timeComponent: timeComponent}, () => 
        {
            if(this.props.onSelected)
            {   
                console.log("ON TIME SELECTED: " + new Date(this.state.dateComponent + this.state.timeComponent));
                console.log("DATE COMPONENT: " + new Date(this.state.dateComponent) + " FROM " + this.state.dateComponent);
                console.log("TIME COMPONENT: "+ new Date(this.state.timeComponent) + " FROM " + this.state.timeComponent);
                this.props.onSelected(new Date(this.state.dateComponent + this.state.timeComponent))
            };
        });
    }

    getDateComponentFrom = (timestamp: Date): number =>
    {
        const ms = timestamp.getTime();
        const remainder = ms % 86400000;

        return ms - remainder - (timestamp.getTimezoneOffset() * 60 * 1000 * -1);
    }

    getTimeComponentFrom = (timestamp: Date): number=>
    {
        console.log("GET TIME COMPONENT: " + timestamp + " FROM " + timestamp.getTime() + " AND WITH OFFSET: " + (timestamp.getTime() + timestamp.getTimezoneOffset() * 60 * 1000));
        //const ms = timestamp.getTime() + (timestamp.getTimezoneOffset() * 60 * 1000);
        //const remainder = ms % 86400000;
        //return remainder;

        const hours = timestamp.getHours() * 60 * 60 * 1000;
        const minutes = timestamp.getMinutes() * 60 * 1000;
        const timezone = 0;// timestamp.getTimezoneOffset() * 60 * 1000 * -1;
        var total = hours + minutes - timezone;

        if(total < 0)
        {   total = 86400000 - total;}

        console.log("Total: " + total + " AND hours: " + hours + " AND minutes: " + minutes + " AND timezone: " + timezone);
        return total;
    }

    render() 
    {
        return(
            <View style={this.props.style}>
                <View style={styles.wrapper}>
                    <InputDateTime disabled={this.state.disabled} style={styles.input_date} onSelected={this.onDateSelected} timestamp={this.state.date} mode="date" />
                    <InputDateTime disabled={this.state.disabled} style={styles.input_time} onSelected={this.onTimeSelected} timestamp={this.state.time} mode="time" /> 
                </View>
            </View>
        );
    }
}