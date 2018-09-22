import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import { Button, Dialog, Text,  Paragraph, TextInput, Portal } from 'react-native-paper';
import Theme from '../../styles/Theme';
import PropTypes from 'prop-types';
import WithInternalState from '../../hocs/WithInternalState';
import UtilityObject from '../../utilities/UtilityObject';

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

/*interface onDismissListener
{
    onDialogDismiss() : void;
}

class State 
{
    visible: boolean;
    title: string;
};*/


export default class AbstractDialog extends Component
{
    constructor(props) 
    {
        super(props);

        this.state = {
            visible: this.props.visible,
            title: this.props.title
        }

        this.onCloseListeners = [this.props.onClose, this.onDialogClosed];
        this.onOpenListeners = [this.props.onOpen, this.onDialogOpened];
        this.onDismissListeners = [this.props.onDismiss, this.onDialogDismissed];
    }

    componentWillMount() 
    {
        this.setVisible(this.state.visible);
    }

    setTitle = (title) =>
    {   this.setState({title: title});}

    setVisible = (visible) =>
    {
        console.log("SETTINg VISIBLE 1: " + visible);

        console.log("SETTINg VISIBLE 2: " + visible);



        if(this.state.visible == visible)
        {   return;}
        
        console.log("SETTING VISIBLE 3: " + visible);
        this.setState({visible: visible}, () => 
        {
            if(visible)
            {   this.notifyListeners(this.onOpenListeners, "onOpenListeners", this);}
            else
            {   this.notifyListeners(this.onCloseListeners, "onCloseListeners", this);}
        });   
    }

    notifyListeners = (listeners, name, ...args) =>
    {
        console.log("Notifying listeners: " + name + " - " + args[1]);
        listeners.forEach(listener => 
        {
            if(listener != undefined && typeof listener === "function")
            {   listener(...args);}
        })
    }

    onDismiss = () =>
    {
        this.setVisible(false);
        this.notifyListeners(this.onDismissListeners, "onDismissListeners", this);
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
    onDismiss: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func
}
