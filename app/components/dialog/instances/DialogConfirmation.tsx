import AbstractDialog, { AbstractDialog_Props_Virtual } from "../AbstractDialog";
import React from "react";
import {StyleSheet} from "react-native";
import WithActions, { WithActionPropsInner } from "../hocs/WithActions";
import {Text, Button, Dialog } from 'react-native-paper';
import Theme from "../../../styles/Theme";
import { Baseable, onBaseReference } from "../../../render_props/Baseable";

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
}

interface State 
{
    message: string,
    textNegative: string,
    textPositive: string
}

export type DialogConfirmationActionUnion = "Positive" | "Negative";

type DialogConfirmationPropsAndInjected = WithActionPropsInner<DialogConfirmationProps, DialogConfirmationActionUnion>; 


export class ConcreteDialogConfirmation extends React.Component<DialogConfirmationPropsAndInjected, State> implements Baseable<AbstractDialog>
{
    private mBase: AbstractDialog | undefined;
    constructor(props: DialogConfirmationPropsAndInjected)
    {
        super(props);

        this.state = {
            message: props.message,
            textNegative: props.textNegative || "Cancel",
            textPositive: props.textPositive || "OK"
        }
    }

    get base () : AbstractDialog | undefined 
    {   return this.mBase;}

    getDialogContent =() =>
    {
        return <Text style={styles.message}>{this.state.message}</Text>
    }

    getDialogActions = () =>
    {
        return (
            <Dialog.Actions>
                <Button color={Theme.colors.primary} onPress={this.props.onActionClicked("Negative")}>{this.state.textNegative}</Button> 
                <Button color={Theme.colors.primary} onPress={this.props.onActionClicked("Positive")}>{this.state.textPositive}</Button>
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

    render()
    {
        return (
            <AbstractDialog 
                ref={onBaseReference(this)}
                content={this.getDialogContent()} 
                actions={this.getDialogActions()} 
                {...this.props} />
        );
    }
}

export default WithActions<ConcreteDialogConfirmation, ConcreteDialogConfirmation, DialogConfirmationActionUnion, DialogConfirmationProps>(ConcreteDialogConfirmation);