import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../styles/Theme';
import PropTypes from 'prop-types';

const styles ={
    content:{
        maxHeight: "75%"
    }
}

export default class AbstractDialog extends Component
{
    constructor(props) 
    {
        super(props);

        this.state = {
            visible: this.props.visible,
        }
    }

    setVisible = (visible) =>
    {
        this.setState({visible: visible});   
    }

    render()
    { 
        return(
            <View>
                <Dialog visible={this.state.visible} onDismiss={this.onDismiss}>
                    <DialogTitle>{this.props.title}</DialogTitle>
                    <View  style={styles.content}>
                        <ScrollView>
                            {this.getDialogContent()}
                        </ScrollView> 
                    </View>
                    {this.getDialogActions()}
                </Dialog>
            </View>
        );
    } 
}

AbstractDialog.propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
}