import React, {Component} from "react";

import {View, ScrollView} from 'react-native';
import { Button, Dialog, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import PropTypes from 'prop-types';
import AbstractDialog from "../AbstractDialog";
import {Text} from "react-native-paper";

const styles ={
    message:{
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10
    }
}

export const DIALOG_ACTION_NEGATIVE = 0;
export const DIALOG_ACTION_POSITIVE = 1;

export default class DialogConfirmation extends AbstractDialog
{
    constructor(props)
    {
        super(props);

        this.onDialogActionPressed = this.props.onDialogActionPressed;
        this.state ={
            ...this.state,
            message: this.props.message,
            textNegative: this.props.textNegative,
            textPositive: this.props.textPositive
        }
    }
    setMessage = (message) =>
    {
        if(message == false)
        {   return;}

        this.setState({message: message});
    }

    setOnDialogActionPressedListener = (listener) =>
    {   this.onDialogActionPressed = listener;}

    onActionPressed = (action) => () =>
    {
        this.setVisible(false);

        if(this.onDialogActionPressed)
        {   this.onDialogActionPressed(action);}
    }

    setActionTextPositive = (text) =>
    {   this.setState({textPositive: text});}
    
    setActionTextNegative = (text) =>
    {   this.setState({textNegative: text});}

    setActionText = (positive, negative) =>
    {   this.setState({textNegative: negative, textPositive: positive});}

    getDialogContent =() =>
    {
        return <Text style={styles.message}>{this.state.message}</Text>
    }

    getDialogActions = () =>
    {
        return (
            <Dialog.Actions>
                <Button color={Theme.colors.primary} onPress={this.onActionPressed(DIALOG_ACTION_NEGATIVE)}>{this.state.textNegative}</Button> 
                <Button color={Theme.colors.primary} onPress={this.onActionPressed(DIALOG_ACTION_POSITIVE)}>{this.state.textPositive}</Button>
            </Dialog.Actions>
        );
    }
}

DialogConfirmation.defaultProps = {
    textPositive: "OK",
    textNegative: "Cancel"
}

DialogConfirmation.propTypes = {
    message: PropTypes.string,
    onDialogActionPressed: PropTypes.func,
    textPositive: PropTypes.string,
    textNegative: PropTypes.string
}