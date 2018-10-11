import React from "react";
import { StyleSheet, View} from 'react-native';
import { Button, Dialog } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import AbstractDialog, { AbstractDialog_Props_Virtual } from "../AbstractDialog";
import {Text} from "react-native-paper";
import * as Progress from "react-native-progress";
import TextGroup from "../../text/TextGroup";
import WithActions, { WithActionPropsInner } from "../hocs/WithActions";
import UtilityCompare from "../../../utilities/UtilityCompare";
import { Baseable, onBaseReference } from "../../../render_props/Baseable";
import { AdjustedCallbackReference } from "../../../render_props/CallbackReference";

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

export type OnTimeOutListener = (dialog: ConcreteDialogLoading, section: string) => void;

export type DialogLoadingProps = AbstractDialog_Props_Virtual & 
{
    message?: string,
    warning?: string,
    section: string,
    timeout?: number,
    onTimeout: OnTimeOutListener
    isComplete: boolean,
    cancelable?: boolean,
    baseRef?: AdjustedCallbackReference<AbstractDialog>
}

export type DialogLoadingActionUnion = "Ok" | "Cancel";
type Lifecycle = "Canceled" | "Running" | "Timed Out" | "Completed";

type DialogLoadingPropsAndInjected = WithActionPropsInner<DialogLoadingProps, DialogLoadingActionUnion>

interface State
{
    message?: string,
    warning?: string,
    timeout: number,
    section: string,
    lifecycle: Lifecycle,
    timeLeft: number,
    cancelable: boolean,
    timeStart: number,
    shouldShowButtonOk: boolean
}

export class ConcreteDialogLoading extends React.Component<DialogLoadingPropsAndInjected, State> implements Baseable<AbstractDialog>
{
    public base: AbstractDialog | undefined;
    public readonly onTimeoutListeners: Array<OnTimeOutListener>;

    constructor(props: DialogLoadingPropsAndInjected)
    {
        super(props);
        
        this.state = 
        {
            message: props.message,
            warning: props.warning,
            timeout: props.timeout || 30000,
            section: props.section,
            lifecycle: "Running",
            timeStart: new Date().getTime(),
            timeLeft: props.timeout || 30000,
            cancelable: props.cancelable || false,
            shouldShowButtonOk: false,
        }

        this.onTimeoutListeners = [];

        const presetListener: OnTimeOutListener | undefined= this.props.onTimeout;
        if(presetListener)
        {   this.onTimeoutListeners.push(presetListener);}
    }

    componentWillReceiveProps = (props: DialogLoadingPropsAndInjected) =>
    {   this.setState({message: props.message, warning: props.warning, timeout: props.timeout || 30000, section: props.section, cancelable: props.cancelable || false});}

    shouldComponentUpdate = (nextProps: DialogLoadingPropsAndInjected, nextState: State) =>
    {   return UtilityCompare.shallowEqual(this.props, nextProps) == false || UtilityCompare.shallowEqual(this.state, nextState) == false;}

    getStatus = (lifecycle: Lifecycle): string =>
    {   
        if(lifecycle == "Completed")
        {   return "Completed";}

        if(lifecycle == "Timed Out")
        {   return "Timed Out";}

        return this.state.section + "..";
    }

    setCompleted = (): boolean  =>
    {
        if(this.state.lifecycle == "Completed")
        {   return false;}

        this.setState({lifecycle: "Completed", shouldShowButtonOk: true});

        if(this.base)
        {
            if(this.base.state.visible == false)
            {   this.base.notifyListeners(this.base.onCloseListeners, "onCloseListeners from ConcreteDialogLoading");}
        }

        return true;
    }

    setMessage = (message: string): boolean =>
    {
        console.log("Set Message: " + this.state.lifecycle + " AND " + message);
        if(message == this.state.message || this.state.lifecycle == "Completed")
        {   return false;}

        this.setState({message: message});
        return true;
    }

    setSection = (section: string): boolean =>
    {
        if(section == this.state.section || this.state.lifecycle != "Running")
        {   return false;}

        this.setState({section: section});
        return true;
    }

    setWarning = (warning?: string): boolean =>
    {
        if(this.state.warning == warning || this.state.lifecycle != "Running")
        {   return false;}

        this.setState({warning: warning});
        return true;
    }

    setCancelable = (cancelable: boolean): boolean =>
    {
        if(this.state.cancelable == cancelable)
        {   return false;}

        this.setState({cancelable: cancelable});
        return true;
    }

    setTimeout = (timeout: number): boolean =>
    {
        if(this.state.timeout == timeout || this.state.lifecycle != "Running")
        {   return false;}

        this.setState({timeout: timeout});
        return true;
    }

    isTimedOut = (): boolean =>
    {   return this.state.lifecycle == "Timed Out";}

    setTimeoutLeft = () =>
    {
        const timeStart: number = this.state.timeStart;
        const now: number = new Date().getTime();
        const difference: number = now - timeStart;
        const left: number = this.state.timeout - difference;
        const seconds: number = Math.floor(left / 1000);
        const remainder: number = left % 1000;

        if(seconds < 0)
        {
            this.onTimeoutListeners.forEach(listener => 
            {   listener(this, this.state.section)});
            this.setState({lifecycle: "Timed Out", timeLeft: seconds, shouldShowButtonOk: true});
        }
        else
        {
            this.setState({timeLeft: seconds});
            if(this.state.lifecycle == "Running")
            {   setTimeout(this.setTimeoutLeft, 1000 - remainder);}
        }

    }
  
    getDialogContent = () =>
    {
        return <View style={styles.wrapper}>
            <TextGroup title="Status">
                <Text style={styles.title}>{this.getStatus(this.state.lifecycle)}</Text>
                <Progress.Bar style={styles.loading} width={undefined} color={Theme.colors.primary} borderRadius={0} progress={1} indeterminate={this.state.lifecycle == "Running"} borderWidth={1} />
                {this.state.lifecycle == "Running" && <Text style={styles.timeout}>Timeout in {this.state.timeLeft} seconds..</Text>}
            </TextGroup>
            <TextGroup title="Result">
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

    onDialogOpen = (_: AbstractDialog): void => 
    {
        this.setTimeoutLeft();
    }

    onBaseReference = (reference?: AbstractDialog): void =>
    {
        if(this.props.baseRef)
        {   this.props.baseRef(reference);}
        if(reference)
        {
            if(reference.onOpenListeners.includes(this.onDialogOpen) == false)
            { 
                reference.onOpenListeners.push(this.onDialogOpen);
            }
        }
    }
    
    onActionPress = (action: DialogLoadingActionUnion) => () =>
    {
        switch(action)
        {
            case "Ok":
                if(this.base)
                {   this.base.setVisible(false);}
                break;

            case "Cancel":
                this.setState({lifecycle: "Canceled"}, () =>
                {
                    if(this.base)
                    {   this.base.onDismiss();}
                });
                break;
        }

        this.props.onActionClicked(action);
    }

    render() 
    {
        return (
            <AbstractDialog 
                ref={onBaseReference(this)} 
                content={this.getDialogContent} 
                actions={this.getDialogActions} 
                {...this.props}/>
        );
    }
}

export default WithActions<ConcreteDialogLoading, ConcreteDialogLoading, DialogLoadingActionUnion, DialogLoadingProps>(ConcreteDialogLoading); 