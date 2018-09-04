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

export default class InputDateTimeSeparate extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            date: this.getDateComponentFrom(this.props.timestamp),
            time: this.getTimeComponentFrom(this.props.timestamp)
        }
    }

    onDateSelected = (timestamp) =>
    {
        const dateComponent = this.getDateComponentFrom(timestamp.getTime());
        this.setState({date: dateComponent}, () => 
        {
            if(this.props.onSelected)
            {   this.props.onSelected(this.state.date + this.state.time)};
        });
    }

    onTimeSelected = (timestamp) => 
    {
        const timeComponent = this.getTimeComponentFrom(timestamp.getTime());

        this.setState({time: timeComponent}, () => 
        {
            if(this.props.onSelected)
            {   this.props.onSelected(this.state.date + this.state.time)};
        });
    }

    getDateComponentFrom = (timestamp) =>
    {
        const ms = timestamp;
        const remainder = ms % 86400000;

        return ms - remainder;
    }

    getTimeComponentFrom = (timestamp) =>
    {
        const ms = timestamp;
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
    timestamp: PropTypes.number.isRequired,
    onSelected: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}