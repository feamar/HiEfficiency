import React from "react";
import { StyleSheet, View} from 'react-native';
import { Button, Dialog } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractDialog, { AbstractDialogPropsVirtual } from "../AbstractDialog";
import {Text} from "react-native-paper";
import * as Progress from "react-native-progress";
import TextGroup from "../../text/TextGroup";
import WithActions from "../hocs/WithActions";
import IDialog from "../IDialog";

const styles = StyleSheet.create({
    wrapper:{
        width: "100%",
        paddingLeft: 20,
        paddingRight: 20,
        display: "flex"
    },
    message:{
    },
    title: {
        paddingBottom: 10
    },
    loading: {
        width: "100%"
    },
    warning: 
    {
        paddingTop: 20,
        color: "red"
    },
    timeout: {
        fontSize: 10,
        width: "100%",
        textAlign: "right"
    }
});

export interface DialogLoadingProps extends AbstractDialogPropsVirtual 
{
    message?: string,
    warning?: string,
    section: string,
    timeout?: number,
    onTimeout: (dialog: DialogLoading) => void,
    isComplete: boolean,
    cancelable?: boolean,
    onActionClicked: (action: DialogLoadingAction) => void
}

export type DialogLoadingAction = "Ok" | "Cancel";

type Lifecycle = "Unstarted" | "Canceled" | "Running" | "Timed Out" | "Completed";
interface State
{
    message?: string,
    warning?: string,
    timeout: number,
    section: string,
    lifecycle: Lifecycle,
    timeLeft: number,
    cancelable: boolean,
    timeStart?: number,
    shouldShowButtonOk: boolean
}

class DialogLoading extends React.Component<DialogLoadingProps, State> implements IDialog
{
    private mBase: AbstractDialog | undefined;

    constructor(props: DialogLoadingProps)
    {
        super(props);
        
        this.state = 
        {
            message: props.message,
            warning: props.warning,
            timeout: props.timeout || 30000,
            section: props.section,
            lifecycle: "Unstarted",
            timeLeft: props.timeout || 30000,
            cancelable: props.cancelable || false,
            shouldShowButtonOk: false,
        }
    }

    get base(): AbstractDialog | undefined 
    {   return this.mBase;}

    getStatus = (lifecycle: Lifecycle): string =>
    {   
        if(lifecycle == "Completed")
        {   return "Completed";}

        if(lifecycle == "Timed Out")
        {   return "Timed Out";}

        return this.state.section + "..";
    }

    onActionPress = (action: DialogLoadingAction) => () =>
    {
        switch(action)
        {
            case "Ok":
                if(this.mBase)
                {   this.mBase.setVisible(false);}
                break;

            case "Cancel":
                if(this.mBase)
                {   this.mBase.onDismiss();}
                break;
        }

        this.props.onActionClicked(action);
    }
    
    getDialogContent = () =>
    {
        return <View style={styles.wrapper}>
            <TextGroup title="Status">
                <Text style={styles.title}>{this.getStatus(this.state.lifecycle)}</Text>
                <Progress.Bar style={styles.loading} width={undefined} color={Theme.colors.primary} borderRadius={0} progress={1} indeterminate={this.state.lifecycle == "Running"} borderWidth={1} />
                {this.state.lifecycle == "Running" && <Text style={styles.timeout}>Timeout in {this.state.timeLeft} seconds..</Text>}
            </TextGroup>
            <TextGroup title="Result" ref={i => console.log(i)}>
                <Text style={styles.message}>{this.state.message}</Text>
                <Text style={styles.warning}>{this.state.warning}</Text>
            </TextGroup>
        </View>
    }

    getDialogActions = () =>
    {
        return (
            <Dialog.Actions>
                 {this.state.cancelable && this.state.lifecycle == "Running" && <Button color={Theme.colors.primary} onPress={this.onActionPress("Cancel")}>Cancel</Button>}
                 {this.state.shouldShowButtonOk && <Button color={Theme.colors.primary} onPress={this.onActionPress("Ok")}>OK</Button>}
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
                {...this.props}/>
        );
    }
}

export default WithActions<DialogLoading, DialogLoadingAction, DialogLoadingProps>(DialogLoading); 