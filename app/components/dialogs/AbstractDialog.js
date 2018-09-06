import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import { Button, Dialog, Text,  Paragraph, TextInput, Portal } from 'react-native-paper';
import Theme from '../../styles/Theme';
import PropTypes from 'prop-types';

const styles ={
    title:{
        padding: 20,
        fontWeight: "bold",
        fontSize: 19
    },
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
            title: this.props.title
        }
    }

    setTitle = (title) =>
    {   this.setState({title: title});}

    setVisible = (visible) =>
    {
        this.setState({visible: visible}, () => 
        {
            if(visible)
            {
                if(this.onDialogOpen)
                {   this.onDialogOpen();}
            }
            else
            {
                if(this.onDialogClose)
                {   this.onDialogClose();}
            }
        });   
    }

    render()
    { 
        return(
            <View>
                <Portal>
                    <Dialog visible={this.state.visible} onDismiss={this.onDismiss}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <View  style={styles.content}>
                            <ScrollView>
                                {this.getDialogContent()}
                            </ScrollView> 
                        </View>
                        {this.getDialogActions()}
                    </Dialog>
                </Portal>
            </View>
        );
    } 
}

AbstractDialog.propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
}