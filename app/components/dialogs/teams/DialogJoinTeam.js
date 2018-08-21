import React, {Component} from "react";

import {View, ScrollView} from 'react-native';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import PropTypes from 'prop-types';

export default class DialogJoinTeam extends Component
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            name: undefined,
            securityCode: undefined,
            visible: this.props.visible
        }
    }


    handleOpen = () =>
    {
        this.setState({visible: true});
    }

    handleDismiss = () => {
        if(this.props.onDialogCanceled)
        {   this.props.onDialogCanceled();}
    }

    handleSave = () => {
        if(this.props.onDialogSubmitted)
        {   this.props.onDialogSubmitted(this.state.name, this.state.securityCode);}
    }

    render(){
        return(
            <View>
                <Dialog visible={this.state.visible} onDismiss={this.handleDismiss}>
                    <DialogTitle>Join Team</DialogTitle>
                    <View  style={styles.content}>
                        <ScrollView>
                            <View style={{marginLeft: 25, marginRight: 25}}>
                                <TextInput name="name" label="Name" value={this.state.name} onChangeText={(value) => this.setState({name: value})}/>
                                <TextInput name="code" label="Security Code" value={this.state.securityCode} onChangeText={(value => this.setState({securityCode: value}))}/>
                            </View>
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


DialogJoinTeam.propTypes = {
    onDialogCanceled: PropTypes.func,
    onDialogSubmitted: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired
}