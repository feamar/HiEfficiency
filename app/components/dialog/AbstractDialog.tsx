import React, { Component } from "react";
import {View, ScrollView} from 'react-native';
import { Dialog, Text,  Portal} from 'react-native-paper';

const styles =
{
    title:
    {
        padding: 20,
        fontWeight: "bold",
        fontSize: 19
    },
    content:
    {   maxHeight: "75%"}
}

export type OnDialogDismissListener = (dialog: AbstractDialog) => void;
export type OnDialogCloseListener   = (dialog: AbstractDialog) => void;
export type OnDialogOpenListener    = (dialog: AbstractDialog) => void;

interface AbstractDialog_Props_Sealed 
{
    visible?: boolean,
    title: string,
    content: JSX.Element,
    actions?: JSX.Element
}

export interface AbstractDialog_Props_Virtual
{
    visible?: boolean,
    title: string
    onDismiss?: OnDialogDismissListener,
    onClose?: OnDialogCloseListener,
    onOpen?: OnDialogOpenListener,
    onBaseReference?: (reference: AbstractDialog | undefined) => void
}

type Props = AbstractDialog_Props_Sealed & AbstractDialog_Props_Virtual;

export interface AbstractDialogState  
{
    visible: boolean,
    title: string,
    content: JSX.Element,
    actions?: JSX.Element
}

export default class AbstractDialog extends Component<Props, AbstractDialogState>
{
    public readonly onCloseListeners: Array<OnDialogCloseListener>;
    public readonly onOpenListeners: Array<OnDialogOpenListener>;
    public readonly onDismissListeners: Array<OnDialogDismissListener>;

    constructor(props: Props)
    {
        super(props);

        this.state = 
        {
            visible: this.props.visible || false,
            title: this.props.title,
            content: this.props.content,
            actions: this.props.actions
        }

        this.onCloseListeners = [];
        this.onOpenListeners = [];
        this.onDismissListeners = [];

        if(this.props.onClose != undefined)
        {   this.onCloseListeners.push(this.props.onClose);}

        if(this.props.onOpen != undefined)
        {   this.onOpenListeners.push(this.props.onOpen);}
        
        if(this.props.onDismiss != undefined)
        {   this.onDismissListeners.push(this.props.onDismiss);}

        if(this.props.visible === true)
        {   this.onOpen();}
    }

    onOpen = (): void =>
    {   this.notifyListeners(this.onOpenListeners, "onOpenListeners");}

    onDismiss = (): void => 
    {
        this.notifyListeners(this.onDismissListeners, "onDismissListeners");
        this.setVisible(false);
    }

    onClose = (): void =>
    {   this.notifyListeners(this.onCloseListeners, "onCloseListeners");}

    setVisible = (visible: boolean) =>
    {
        if(this.state.visible == visible)
        {   return;}
        
        this.setState({visible: visible}, () => 
        {
            if(visible)
            {   this.onOpen();}
            else
            {   this.onClose();}
        });   
    }

    setTitle = (title: string) =>
    {   this.setState({title: title});}

    notifyListeners = (listeners: Array<(dialog: AbstractDialog) => void>, name: string) =>
    {
        console.log("Notifying listeners: " + name);
        listeners.forEach(listener => 
        {   listener(this);});
    }

    render() 
    {

        return (
            <View>
                <Portal>
                    <Dialog visible={this.state.visible} onDismiss={this.onDismiss}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <View  style={styles.content}>
                            <ScrollView>
                                {   this.state.content}
                            </ScrollView> 
                        </View>
                        {   this.state.actions && this.state.actions}
                    </Dialog>
                </Portal>
            </View>
        );
    }
}