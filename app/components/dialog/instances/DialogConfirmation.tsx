import AbstractDialog, { AbstractDialog_Props_Virtual } from "../AbstractDialog";
import React from "react";
import {StyleSheet} from "react-native";
import WithActions, { WithActionPropsInner, OnActionClickedListener } from "../hocs/WithActions";
import {Text, Button, Dialog } from 'react-native-paper';
import Theme from "../../../styles/Theme";
import { Baseable, onBaseReference } from "../../../render_props/Baseable";
import { AdjustedCallbackReference } from "../../../render_props/CallbackReference";

const styles = StyleSheet.create({
    message:{
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10
    }
});

type DialogConfirmationProps = AbstractDialog_Props_Virtual & 
{
    message: string,
    textNegative?: string,
    textPositive?: string
    baseRef?: AdjustedCallbackReference<AbstractDialog>
}

interface State 
{
    message: string,
    textNegative: string,
    textPositive: string
}

export type DialogConfirmationActionUnion = "Positive" | "Negative";

type DialogConfirmationPropsAndInjected = WithActionPropsInner<ConcreteDialogConfirmation, DialogConfirmationProps, DialogConfirmationActionUnion>; 


export class ConcreteDialogConfirmation extends React.Component<DialogConfirmationPropsAndInjected, State> implements Baseable<AbstractDialog>
{
    public base: AbstractDialog | undefined;
    constructor(props: DialogConfirmationPropsAndInjected)
    {
        super(props);

        this.state = {
            message: props.message,
            textNegative: props.textNegative || "Cancel",
            textPositive: props.textPositive || "OK"
        }
    }

    getDialogContent = () =>
    {
        return <Text style={styles.message}>{this.state.message}</Text>
    }

    onActionClicked = (action: DialogConfirmationActionUnion) => 
    {
        this.props.onActionClicked(action);
        if(this.base)
        {   this.base.setVisible(false);}
    }

    addOnActionClickedListener = (listener: OnActionClickedListener<ConcreteDialogConfirmation, DialogConfirmationActionUnion>) =>
    {   return this.props.addOnActionClickedListener(listener);}
    
    removeOnActionClickedListener = (listener: OnActionClickedListener<ConcreteDialogConfirmation, DialogConfirmationActionUnion>) =>
    {   return this.props.removeOnActionClickedListener(listener);}

    getDialogActions = () =>
    {
        return (
            <Dialog.Actions>
                <Button color={Theme.colors.primary} onPress={() => this.onActionClicked("Negative") }>{this.state.textNegative}</Button> 
                <Button color={Theme.colors.primary} onPress={() => this.onActionClicked("Positive")}>{this.state.textPositive}</Button>
            </Dialog.Actions>
        );
    }

    setMessage = (message: string) =>
    {   this.setState({message: message});}

    setActionTextPositive = (text: string) =>
    {   this.setState({textPositive: text});}
    
    setActionTextNegative = (text: string) =>
    {   this.setState({textNegative: text});}

    setActionText = (positive: string, negative: string)  =>
    {   this.setState({textPositive: positive, textNegative: negative});}

    onBaseReference = (reference?: AbstractDialog): void =>
    {
        if(this.props.baseRef)
        {   this.props.baseRef(reference);}
    }

    render()
    {
        return (
            <AbstractDialog 
                ref={onBaseReference(this)}
                content={this.getDialogContent} 
                actions={this.getDialogActions} 
                {...this.props} />
        );
    }
}

export default WithActions<ConcreteDialogConfirmation, ConcreteDialogConfirmation, DialogConfirmationActionUnion, DialogConfirmationProps>(ConcreteDialogConfirmation);