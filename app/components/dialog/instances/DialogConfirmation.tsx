import AbstractDialog, { AbstractDialogPropsVirtual } from "../AbstractDialog";
import React from "react";
import {StyleSheet} from "react-native";
import IDialog from "../IDialog";
import WithActions from "../hocs/WithActions";
import {Text, Button, Dialog } from 'react-native-paper';
import Theme from "../../../styles/Theme";

const styles = StyleSheet.create({
    message:{
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10
    }
});

interface DialogConfirmationProps extends AbstractDialogPropsVirtual
{
    onActionClicked: (dialog: DialogConfirmation, action: ActionEnumType) => void,
    message: string
}

interface State 
{
    message: string
}

type ActionEnumType = "Positive" | "Negative" | "Neutral";

class DialogConfirmation extends React.Component<DialogConfirmationProps, State> implements IDialog
{
    private mBase: AbstractDialog | undefined;
    constructor(props: DialogConfirmationProps)
    {
        super(props);

        this.state = {
            message: props.message
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
                <Button color={Theme.colors.primary} onPress={this.onActionPressed(ActionType.NEGATIVE)}>{this.state.textNegative}</Button> 
                <Button color={Theme.colors.primary} onPress={this.onActionPressed(ActionType.POSITIVE)}>{this.state.textPositive}</Button>
            </Dialog.Actions>
        );
    }

    render()
    {
        return (
            <AbstractDialog 
                ref={i => i == null ? this.mBase = undefined : this.mBase = i}
                content={this.getDialogContent()} 
                actions={this.getDialogActions()} 
                {...this.props} />
        );
    }
}

export default WithActions<DialogConfirmation, DialogConfirmationProps, ActionEnumType>(DialogConfirmation);