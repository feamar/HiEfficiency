import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import PropTypes from 'prop-types';

const styles ={
    content:{
        maxHeight: "75%"
    }
}

export default class AbstractPreferenceDialog extends Component
{
    constructor(props) 
    {
        super(props);

        this.state = {
            visible: this.props.visible,
            value: this.props.value
        }
    }

    handleOpen = () =>
    {
        console.log("SETTING STATE!");
        this.setState({visible: true});   
        console.log("DONE SETTING STATE!");
    }

    handleDismiss = () =>
    {
        this.setState({visible: false});

        if(this.props.onDialogCanceled)
        {   this.props.onDialogCanceled();}
    }

    handleSave = () =>
    {
        console.log("ABS VALUE: " + JSON.stringify(this.state.value));
        if(this.props.onDialogSubmitted)
        {   this.props.onDialogSubmitted(this.state.value);}

        this.setState({visible: false});
    }

    handleValueChange = (value) =>
    {
        console.log("HANDLE!: " + JSON.stringify(value));
        this.setState({value: value});
    }
 
    render()
    { 
        console.log("RENDING ABSTRACT PREFERENCE DIALOG!");
        return(
            <View>
                <Dialog visible={this.state.visible} onDismiss={this.handleDismiss}>
                    <DialogTitle>{this.props.title}</DialogTitle>
                    <View  style={styles.content}>
                        <ScrollView>
                            {this.props.children}
                        </ScrollView>
                    </View>
                    <DialogActions>
                        <Button color={Theme.colors.primary} onPress={this.handleDismiss}>Cancel</Button>
                        <Button color={Theme.colors.primary} onPress={this.handleSave}>Save</Button>
                    </DialogActions>
                </Dialog>
            </View>
        );
    }
}

AbstractPreferenceDialog.propTypes = {
    title: PropTypes.string.isRequired,
    onDialogCanceled: PropTypes.func.isRequired,
    onDialogSubmitted: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    value: PropTypes.any.isRequired 
}