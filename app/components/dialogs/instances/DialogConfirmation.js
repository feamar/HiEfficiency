import React, {Component} from "react";

import {View, ScrollView} from 'react-native';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import PropTypes from 'prop-types';
import AbstractDialog from "../AbstractDialog";
import {Text} from "react-native-paper";

const styles ={
    message:{
        padding: 20 
    }
}

export const DIALOG_ACTION_CANCEL = "Cancel";
export const DIALOG_ACTION_OK = "OK";

export default class DialogConfirmation extends AbstractDialog
{
    constructor(props)
    {
        super(props);
    }

    getDialogContent =() =>
    {
        return <Text style={styles.message}>{this.props.message}</Text>
    }

    onActionPressed = (action) => () =>
    {
        if(this.props.onDialogActionPressed)
        {   this.props.onDialogActionPressed(action);}

        this.setVisible(false);
    }

    getDialogActions = () =>
    {
        return (
            <DialogActions>
                <Button color={Theme.colors.primary} onPress={this.onActionPressed(DIALOG_ACTION_CANCEL)}>Cancel</Button> 
                <Button color={Theme.colors.primary} onPress={this.onActionPressed(DIALOG_ACTION_OK)}>OK</Button>
            </DialogActions>
        );
    }
}

DialogConfirmation.propTypes = {
    message: PropTypes.string.isRequired,
    onDialogActionPressed: PropTypes.func.isRequired
}