import React, {Component} from  "react";
import {View} from "react-native";
import {Text} from "react-native-paper";
import PropTypes from "prop-types";
import {TouchableRipple} from "react-native-paper";
import DateTimePicker from 'react-native-modal-datetime-picker';
import UtilityTime from "../../utilities/UtilityTime";

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

export default class InputTime extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            time: this.props.time,
            disabled: this.props.disabled,
            open: false
        }
    }

    onCancel = () =>
    {   this.close();}

    onConfirm = (time) =>
    {
        this.close();
        this.setState({time: time.getTime()}, () => 
        {
           if(this.props.onTimeSelected)
           {    this.props.onTimeSelected(time.getTime());} 
        });
    }

    open = () =>
    {   this.setState({open: true});}
    
    close = () =>
    {   this.setState({open: false});}

    render() 
    {
        return(
            <View style={this.props.style}>
                <TouchableRipple disabled={this.state.disabled} style={styles.touchable} onPress={this.open}><Text>{UtilityTime.dateToHHMM(new Date(this.state.time))}</Text></TouchableRipple>
                <DateTimePicker datePickerModeAndroid="default" date={new Date(this.state.time)} onCancel={this.onCancel} mode="time" isVisible={this.state.open} onConfirm={this.onConfirm} />
            </View>
        );
    }
}


InputTime.propTypes = {
    time: PropTypes.number.isRequired,
    onTimeSelected: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}