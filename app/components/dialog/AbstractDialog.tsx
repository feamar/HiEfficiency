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
    {
        maxHeight: "75%",
        flexShrink: 1
    },
    actions:
    {
        flexShrink: 0
    }
}

export type OnDialogDismissListener = (dialog: AbstractDialog) => void;
export type OnDialogCloseListener   = (dialog: AbstractDialog) => void;
export type OnDialogOpenListener    = (dialog: AbstractDialog) => void;

interface AbstractDialog_Props_Sealed 
{
    visible?: boolean,
    title: string,
    content: () => JSX.Element,
    actions?: () => JSX.Element
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
    content: () => JSX.Element,
    actions?: () => JSX.Element
}

export default class AbstractDialog extends Component<Props, AbstractDialogState>
{
    private onCloseListeners: Array<OnDialogCloseListener>;
    private onOpenListeners: Array<OnDialogOpenListener>;
    private onDismissListeners: Array<OnDialogDismissListener>;

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

    componentWillReceiveProps = (props: Props) =>
    {
        if(props.visible != this.props.visible)
        {   this.setState({visible: props.visible || this.state.visible});}

        if(props.title != this.props.title)
        {   this.setState({title: props.title});}

        if(props.content != this.props.content)
        {   this.setState({content: props.content});}

        if(props.actions != this.props.actions)
        {   this.setState({actions: props.actions});}
    }

    onOpen = (): void =>
    {   this.notifyListeners(this.onOpenListeners, "onOpenListeners");}

    onDismiss = (): void => 
    {
        this.notifyListeners(this.onDismissListeners, "onDismissListeners");
        this.setVisible(false);
    }

    onClose = (): void =>
    {   
        this.notifyListeners(this.onCloseListeners, "onCloseListeners");
    }

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

    notifyListeners = (listeners: Array<(dialog: AbstractDialog) => void>, _name: string) =>
    {
        listeners.forEach(listener => 
        {   listener(this);});
    }

    addOnCloseListener(listener: OnDialogCloseListener): boolean
    {
        if(this.onCloseListeners.includes(listener))
        {   return false;}

        this.onCloseListeners.push(listener);
        return true;
    }

    
    removeOnCloseListener(listener: OnDialogCloseListener): boolean
    {
        const index = this.onCloseListeners.indexOf(listener);
        if(index < 0)
        {   return false;}

        this.onCloseListeners = this.onCloseListeners.splice(index, 1);
        return true;
    }

    addOnDismissListener(listener: OnDialogDismissListener): boolean
    {
        if(this.onDismissListeners.includes(listener))
        {   return false;}

        this.onDismissListeners.push(listener);
        return true;
    }

    removeOnDismissListener(listener: OnDialogDismissListener): boolean
    {
        const index = this.onDismissListeners.indexOf(listener);
        if(index < 0)
        {   return false;}

        this.onDismissListeners = this.onDismissListeners.splice(index, 1);
        return true;
    }

    addOnOpenListener(listener: OnDialogOpenListener): boolean
    {
        if(this.onOpenListeners.includes(listener))
        {   return false;}

        this.onOpenListeners.push(listener);
        return true;
    }

    removeOnOpenListener(listener: OnDialogOpenListener): boolean
    {
        const index = this.onOpenListeners.indexOf(listener);
        if(index < 0)
        {   return false;}

        this.onOpenListeners = this.onOpenListeners.splice(index, 1);
        return true;
    }

    render() 
    {

        return (
            <View>
                <Portal>
                    <Dialog visible={this.state.visible} onDismiss={this.onDismiss}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <View  style={styles.content}>
                            <ScrollView keyboardShouldPersistTaps={"handled"}>
                                {   this.state.content()}
                            </ScrollView> 
                        </View>
                        <View style={styles.actions}>
                            {   this.state.actions && this.state.actions()}
                        </View>
                    </Dialog>
                </Portal>
            </View>
        );
    }
}