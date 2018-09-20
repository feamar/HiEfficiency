import React, {Component} from  "react";
import {View} from "react-native";
import {Text} from "react-native-paper";
import PropTypes from "prop-types";
import {TouchableRipple} from "react-native-paper";
import DateTimePicker from 'react-native-modal-datetime-picker';
import UtilityTime from "../../utilities/UtilityTime";
import {asDate} from "../util/DateUtil";

const styles = {
    touchable:
    {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#CECECE"
    }
}

export default class InputDateTime extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            timestamp: this.props.timestamp,
            disabled: this.props.disabled,
            open: false,
            mode: this.props.mode
        }
    }

    onCancel = () =>
    {   this.close();}

    onConfirm = (timestamp) =>
    {
        this.close();
        this.setState({timestamp: timestamp}, () => 
        {
           if(this.props.onSelected)
           {    this.props.onSelected(timestamp);} 
        });
    }

    open = () =>
    {   this.setState({open: true});}
    
    close = () =>
    {   this.setState({open: false});}

    getDisplayValue = (timestamp, mode) =>
    {
        const date = new Date(timestamp);
        switch(mode)
        {
            case "date":
                return asDate(date);
            case "time":
                return UtilityTime.dateToHHMM(date);

            case "datetime":
                return this.getDisplayValue(timestamp, "date") + " " + this.getDisplayValue(timestamp, "time");
        }

        return "Undefined";
    }

    componentDidCatch(error, info)
    {
        this.setState({error: error});
    }

    render() 
    {
        return(
            <View testID="root" style={this.props.style}>
                <TouchableRipple testID="touchable" disabled={this.state.disabled} style={styles.touchable} onPress={this.open}><Text testID="text">{this.getDisplayValue(this.state.timestamp, this.state.mode)}</Text></TouchableRipple>
                {this.state.error == undefined && <DateTimePicker testID="picker" datePickerModeAndroid="default" date={new Date(this.state.timestamp)} onCancel={this.onCancel} mode={this.state.mode} isVisible={this.state.open} onConfirm={this.onConfirm} />}
            </View>
        );
    }
}

InputDateTime.defaultProps ={
    mode: "datetime"
}


InputDateTime.propTypes = {
    timestamp: PropTypes.any.isRequired,
    onSelected: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    mode: PropTypes.string.isRequired
}