import React, {Component} from  "react";
import {View, StyleSheet, ViewStyle, TextStyle, ImageStyle, RegisteredStyle} from "react-native";
import {Text} from "react-native-paper";
import {TouchableRipple} from "react-native-paper";
import DateTimePicker from 'react-native-modal-datetime-picker';
import UtilityTime from "../../utilities/UtilityTime";
import {asDate} from "../util/DateUtil";

const styles = StyleSheet.create({
    touchable:
    {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: "center",
        width: "100%", 
        borderBottomWidth: 1,
        borderBottomColor: "#CECECE"
    }
});

type Mode = "date" | "time" | "datetime"  

interface Props
{
    timestamp: Date,
    disabled?: boolean,
    mode: Mode,
    onSelected: (timestamp: Date) => void,
    style?: RegisteredStyle<ViewStyle | TextStyle | ImageStyle>
}

interface State
{
    timestamp: Date,
    disabled: boolean,
    open: boolean,
    mode: Mode,
    error?: string
}


export default class InputDateTime extends Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state = {
            timestamp: this.props.timestamp,
            disabled: this.props.disabled || false,
            open: false,
            mode: this.props.mode
        }
    }

    onCancel = () =>
    {   this.close();}

    onConfirm = (timestamp: Date) =>
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

    getDisplayValue = (timestamp: Date, mode: Mode): string =>
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

    componentDidCatch(error: Error, _: any)
    {   this.setState({error: error.toString()});}

    render() 
    {
        return(
            <View testID="root" style={this.props.style}>
                <TouchableRipple disabled={this.state.disabled} style={styles.touchable} onPress={this.open}><Text testID="text">{this.getDisplayValue(this.state.timestamp, this.state.mode)}</Text></TouchableRipple>
                {this.state.error == undefined && <DateTimePicker datePickerModeAndroid="spinner" date={new Date(this.state.timestamp)} onCancel={this.onCancel} mode={this.state.mode} isVisible={this.state.open} onConfirm={this.onConfirm} />}
            </View>
        );
    }
}
