import React, {Component} from 'react';
import { View, TouchableHighlight } from "react-native";

import { Text, TouchableRipple } from 'react-native-paper';
import DialogPreferenceText from '../../dialogs/preferences/DialogPreferenceText';
import AbstractPreference from './AbstractPreference';

const styles = {
    root: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    title:{
        fontWeight: "bold"
    },
    value:{
        color: "#919191"
    } 
} 
export default class PreferenceText extends Component
{
    constructor(props)
    {
        super(props);

        this.state ={
            value: this.props.value
        }
    }

    handlePress = () =>
    { 
        this.dialog.base.handleOpen();
    }

    onDialogCanceled = () =>
    {
    } 

    onDialogSubmitted = (value) =>
    {
        this.setState({value: value});
        this.preference.setState({value: value});

        if (this.props.onValueChanged){
            this.props.onValueChanged(value);
        }
    }
 
    render()
    { 
        return(  
            <View>
                <AbstractPreference ref={instance => this.preference = instance} title={this.props.title} value={this.state.value} onPress={this.handlePress} />
                <DialogPreferenceText ref={instance => this.dialog = instance} title={this.props.title} visible={false} value={this.state.value} label={this.props.title} onDialogCanceled={this.onDialogCanceled} onDialogSubmitted={this.onDialogSubmitted}/>
            </View>             
        );
    }
 
}
