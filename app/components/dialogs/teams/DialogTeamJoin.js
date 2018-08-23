import React, {Component} from "react";

import {View, ScrollView, ToastAndroid} from 'react-native';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import PropTypes from 'prop-types';
import AbstractDialog from "../AbstractDialog";

const styles ={
    content:{
        maxHeight: "75%"
    }
}


export default class DialogTeamJoin extends AbstractDialog
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            fields:{
                name: undefined,
                code: undefined,
            },
            visible: this.props.visible
        }
    }

    onDismiss = () => 
    {
        if(this.props.onDialogCanceled)
        {   this.props.onDialogCanceled();}

        this.setVisible(false);
    }

    onSave = () => 
    {
        if(this.state.fields.name == undefined || this.state.fields.name == "")
        {
            ToastAndroid.show("Please enter a group name first.", ToastAndroid.SHORT);
            return;
        }

        if(this.state.fields.code == undefined || this.state.fields.code == "")
        {
            ToastAndroid.show("Please enter the security code for the group first.", ToastAndroid.LONG);
            return;
        }

        if(this.props.onDialogSubmitted)
        {   this.props.onDialogSubmitted(this.state.fields.name, this.state.fields.code);}

        this.setVisible(false);
    }

    onValueChanged = (field) => (value) => 
    {
        const fields = this.state.fields;
        fields[field] = value;
        this.setState({fields: fields});
    }

    getDialogContent =() =>
    {
        return (
            <ScrollView>
                <View style={{marginLeft: 25, marginRight: 25}}>
                    <TextInput name="name" label="Name" value={this.state.name} onChangeText={this.onValueChanged("name")}/>
                    <TextInput name="code" label="Security Code" value={this.state.code} onChangeText={this.onValueChanged("code")}/>
                </View>
            </ScrollView>
        );
    }

    getDialogActions = () =>
    {
        return (
            <DialogActions>
                <Button color={Theme.colors.primary} onPress={this.onDismiss}>Cancel</Button>
                <Button color={Theme.colors.primary} onPress={this.onSave}>Save</Button>
            </DialogActions>
        );
    }
}


DialogTeamJoin.propTypes = {
    onDialogCanceled: PropTypes.func,
    onDialogSubmitted: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired
}