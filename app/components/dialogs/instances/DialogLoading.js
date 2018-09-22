import React, {Component} from "react";

import {View, ScrollView} from 'react-native';
import { Button, Dialog, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../../styles/Theme';
import PropTypes from 'prop-types';
import AbstractDialog from "../AbstractDialog";
import {Text} from "react-native-paper";
import ActionType from "../../../enums/ActionType";
import * as Progress from "react-native-progress";
import UtilityCompare from "../../../utilities/UtilityCompare";
import UtilityObject from "../../../utilities/UtilityObject";
import PreferenceCategory from "../../preferences/PreferenceCategory";
import TextGroup from "../../text/TextGroup";

const styles ={
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
}

const MINIMUM_PROCESS_TIME_TO_AVOID_FLICKERING = 2000;

const STATE_CANCELED = 0;
const STATE_RUNNING = 1;
const STATE_TIMED_OUT = 2;
const STATE_COMPLETED = 3;

export default class DialogLoading extends AbstractDialog
{
    constructor(props)
    {
        super(props);

        this.onDialogActionPressed = this.props.onDialogActionPressed;
        this.state ={
            ...this.state,
            message: this.props.message,
            warning: this.props.warning,
            timeout: this.props.timeout,
            section: this.props.section,
            lifecycle: STATE_RUNNING,
            timeLeft: Math.floor(this.props.timeout / 1000),
            cancelable: this.props.cancelable,
            timeStart: new Date().getTime(),
            shouldShowButtonOk: false,
        }

        this.onTimeoutListeners = [this.props.onTimeout];
        this.onOpenListeners.push(this.onDialogOpen);

        if(this.state.visible)
        {   this.onDialogOpen();}
    }

    componentWillMount() 
    {   this.mounted = true;}

    componentWillUnmount()
    {   this.mounted = false;}

    setStateInternal = (update, whenDone) =>
    {
        if(this.mounted)
        {   this.setState(update, whenDone);}
        else
        {
            this.state = {
                ...this.state,
                ...update
            }

            if(whenDone)
            {   whenDone();}
        }
    }

    setCompleted = () =>
    {
        if(this.state.lifecycle == STATE_COMPLETED)
        {   return false;}

        this.setStateInternal({lifecycle: STATE_COMPLETED});
        this.setState({shouldShowButtonOk: true});

        if(this.state.visible == false)
        {   this.notifyListeners(this.onCloseListeners, "onCloseListeners from DialogLoading", this);}
    }
   
    setMessage = (message) =>
    {
        if(message == false || this.state.message == message || this.state.lifecycle != STATE_RUNNING)
        {   return false;}
 
        this.setStateInternal({message: message});
    }

    setSection = (section)=>
    {
        if(section == false || this.state.section == section || this.state.lifecycle != STATE_RUNNING)
        {   return false;}

        this.setStateInternal({section: section});
    }

    setWarning = (warning) =>
    {
        if(this.state.warning == warning || this.state.lifecycle != STATE_RUNNING)
        {   return false;}

        this.setStateInternal({warning: warning});
    }

    setCancelable = (cancelable) =>
    {
        if(this.state.cancelable == cancelable || this.state.lifecycle != STATE_RUNNING)
        {   return false;}

        this.setStateInternal({cancelable: cancelable});
    }

    setTimeout = (timeout) =>
    {
        if(this.state.timeout == timeout || this.state.lifecycle != STATE_RUNNING)
        {   return false;}

        this.setStateInternal({timeout: timeout});
    }

    onDialogOpen = () =>
    {
        this.setTimeoutLeft();
    }

    setTimeoutLeft = () =>
    {
        const now = new Date().getTime();
        const difference = now - this.state.timeStart;
        const left = this.state.timeout - difference;
        const seconds = Math.floor(left / 1000);
        const remainder = left % 1000;

        if(seconds < 0)
        {
            this.notifyListeners(this.onTimeoutListeners, "onTimeoutListeners from DialogLoading", this, this.state.section);
            this.setStateInternal({lifecycle: STATE_TIMED_OUT, timeLeft: seconds});
        }
        else
        {   this.setStateInternal({timeLeft: seconds});}
        
        //console.log("SETTING TIMEOUT LEFT: " + seconds);

        if(this.state.lifecycle == STATE_RUNNING)
        {   setTimeout(this.setTimeoutLeft, 1000 - remainder);}
    }

    isTimedOut = () =>
    {   return this.state.lifecycle == STATE_TIMED_OUT;}

    onCancel = () => 
    {
        this.setStateInternal({lifecycle: STATE_CANCELED}, () => 
        {   this.onDismiss();});
    }

    onDialogClose = () => 
    {   this.setStateInternal({timeStart: undefined});}

    componentWillReceiveProps = (props) =>
    {
        this.setStateInternal({message: props.message, warning: props.warning, timeout:props.timeout, section: props.section, cancelable: props.cancelable});
    }

    shouldComponentUpdate = (nextProps, nextState) =>
    {   return UtilityCompare.shallowEqual(this.props, nextProps) == false || UtilityCompare.shallowEqual(this.state, nextState) == false;}

    getDialogContent = () =>
    {
        return <View style={styles.wrapper}>
            <TextGroup title="Status">
                <Text style={styles.title}>{this.state.lifecycle == STATE_COMPLETED ? "Completed" : this.state.lifecycle  == STATE_TIMED_OUT ? "Timed out" :  (this.state.section + "..")}</Text>
                <Progress.Bar style={styles.loading} width={null} color={Theme.colors.primary} borderRadius={0} progress={1} indeterminate={this.state.lifecycle == STATE_RUNNING} style={styles.loading.loader} borderWidth={1} />
                {this.state.lifecycle == STATE_RUNNING && <Text style={styles.timeout}>Timeout in {this.state.timeLeft} seconds..</Text>}
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
                 {this.state.cancelable && this.state.lifecycle == STATE_RUNNING && <Button color={Theme.colors.primary} onPress={this.onCancel}>Cancel</Button>}
                 {this.state.shouldShowButtonOk && <Button color={Theme.colors.primary} onPress={() => this.setVisible(false)}>OK</Button>}
            </Dialog.Actions>
        );
    }
}

DialogLoading.defaultProps = {
    timeout: 30000
}

DialogLoading.propTypes = {
    message: PropTypes.string,
    warning: PropTypes.string,
    section: PropTypes.string.isRequired,
    timeout: PropTypes.number.isRequired,
    onTimeout: PropTypes.func,
    isComplete: PropTypes.bool.isRequired,
    cancelable: PropTypes.bool
}