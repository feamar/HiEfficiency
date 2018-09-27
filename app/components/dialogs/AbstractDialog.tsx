import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import { Dialog, Text,  Portal} from 'react-native-paper';

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

export type OnDialogDismissListener = (dialog: AbstractDialog) => void;
export type OnDialogCloseListener   = (dialog: AbstractDialog) => void;
export type OnDialogOpenListener    = (dialog: AbstractDialog) => void;


interface IState 
{
    visible : boolean,
    title: string,
}

interface IProps  
{
    visible: boolean,
    title: string,
    section: string,
    onDismiss?: OnDialogDismissListener,
    onClose?: OnDialogCloseListener,
    onOpen?: OnDialogOpenListener
}

export default abstract class AbstractDialog<Props, State> extends Component<Props & IProps, State & IState>
{
    public readonly onCloseListeners: Array<OnDialogCloseListener>;
    public readonly onOpenListeners: Array<OnDialogOpenListener>;
    public readonly onDismissListeners: Array<OnDialogDismissListener>;

    constructor(props: IProps) 
    {
        super(props);

        this.state = 
        {
            visible: this.props.visible,
            title: this.props.title,
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
    }

    componentWillMount() 
    {   this.setVisible(this.state.visible);}

    setTitle = (title: string) =>
    {   this.setState({title: title});}

    setVisible = (visible: boolean) =>
    {
        if(this.state.visible == visible)
        {   return;}
        
        this.setState({visible: visible}, () => 
        {
            if(visible)
            {   this.notifyListeners(this.onOpenListeners, "onOpenListeners");}
            else
            {   this.notifyListeners(this.onCloseListeners, "onCloseListeners");}
        });   
    }

    notifyListeners = (listeners: Array<(dialog: AbstractDialog) => void>, name: string) =>
    {
        console.log("Notifying listeners: " + name);
        listeners.forEach(listener => 
        {   listener(this);});
    }

    onDismiss = () =>
    {
        this.setVisible(false);
        this.notifyListeners(this.onDismissListeners, "onDismissListeners");
    }

    abstract getDialogContent () : Component;
    abstract getDialogActions () : Component;
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