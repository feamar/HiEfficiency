import React, {Component} from "react";
import PropTypes from "prop-types";
import {View} from "react-native";
import InputDateTime from "./InputDateTime";

const styles = {
   wrapper:{
    display: "flex",
    flexDirection: "row"
   },
   input:{
    date:
    {
        flex: 1,
        marginRight: 5
    },
    time:
    {
        flex: 1,
        marginLeft: 5
    }
   }
}

const TIME_IS_LEADING = 0;
const DATE_IS_LEADING = 1;

export default class InputDateTimeSeparate extends Component
{
    constructor(props)
    {
        super(props);

        console.log("INPUT DATE: " + this.props.timestamp);

        if(this.props.timestamp == undefined)
        {   this.props.timestamp = new Date();}

        this.state = {
            time: this.props.timestamp,
            timeComponent: this.getTimeComponentFrom(this.props.timestamp),
            date: this.props.timestamp,
            dateComponent: this.getDateComponentFrom(this.props.timestamp)
        }
    }

    onDateSelected = (timestamp) =>
    {
        const dateComponent = this.getDateComponentFrom(timestamp);
        this.setState({date: timestamp, dateComponent: dateComponent}, () => 
        {
            if(this.props.onSelected)
            {   this.props.onSelected(new Date(this.state.dateComponent + this.state.timeComponent))};
        });
    }

    onTimeSelected = (timestamp) => 
    {
        console.log("Separate Time: " + timestamp);
        const timeComponent = this.getTimeComponentFrom(timestamp);
        console.log("TIme component: " + timeComponent);

        this.setState({time: timestamp, timeComponent: timeComponent}, () => 
        {
            if(this.props.onSelected)
            {   this.props.onSelected(new Date(this.state.dateComponent + this.state.timeComponent))};
        });
    }

    getDateComponentFrom = (timestamp) =>
    {
        const ms = timestamp.getTime();
        const remainder = ms % 86400000;

        return ms - remainder;
    }

    getTimeComponentFrom = (timestamp) =>
    {
        const ms = timestamp.getTime();
        const remainder = ms % 86400000;

        return remainder;
    }

    render() 
    {
        return(
            <View style={this.props.style}>
                <View style={styles.wrapper}>
                    <InputDateTime disabled={this.props.disabled} style={styles.input.date} onSelected={this.onDateSelected} timestamp={this.state.date} mode="date" />
                    <InputDateTime disabled={this.props.disabled} style={styles.input.time} onSelected={this.onTimeSelected} timestamp={this.state.time} mode="time" /> 
                </View>
            </View>
        );
    }
}

InputDateTimeSeparate.defaultProps ={
}

InputDateTimeSeparate.propTypes = {
    timestamp: PropTypes.any,
    onSelected: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}