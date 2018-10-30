import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "react-native-paper";
import { Dropdown } from 'react-native-material-dropdown';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from '../../preferences/AbstractPreferenceDialog';
import InterruptionType from '../../../../enums/InterruptionType';
import EntityInterruption from '../../../../dtos/firebase/firestore/entities/EntityInterruption';
import InputError from '../../../inputs/InputError';
import SelectOption from '../../../../dtos/options/SelectOption';
import { Baseable, onBaseReference } from '../../../../render_props/Baseable';
import Theme from '../../../../styles/Theme';
import UtilityTime from '../../../../utilities/UtilityTime';
import InputDateTimeSeparate from '../../../inputs/InputDateTimeSeparate';

const styles = StyleSheet.create({
    wrapper: {
        marginLeft: 25, 
        marginRight: 25,
    },
    inputWrapper:
    {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 5
    },
    input:
    {
        flex: 1,
        width: "100%"
    },
    fieldTitle:
    {
        color: Theme.colors.primary
    },
    fieldTitle2:
    {
        color: Theme.colors.primary,
        marginTop: 10
    },
    fieldTitle3:
    {
        color: Theme.colors.primary,
        marginTop: 10
    },

    field_start:
    {
        marginTop: 5,
        marginBottom: 5
    },
    field_end: {
        marginTop: 5, 
        marginBottom: 5
    },
});

type DialogInterruptionEdit_Props = AbstractPreferenceDialog_Props_Virtual<StorageValue> & 
{   
    shouldShowEnd?: boolean
}

interface State
{
    shouldShowEnd: boolean
}

type StorageValue = DialogInterruptionEdit_StorageValue;
export interface DialogInterruptionEdit_StorageValue
{
    start?: Date,
    end?: Date,
    type: InterruptionType,
    previous?: EntityInterruption,
    next?: EntityInterruption
}

export default class DialogInterruptionEdit extends React.Component<DialogInterruptionEdit_Props, State> implements Baseable<AbstractPreferenceDialog<StorageValue>>
{
    public base: AbstractPreferenceDialog<StorageValue> | undefined;

    constructor(props: DialogInterruptionEdit_Props)
    {
        super(props);

        this.state = 
        {
            shouldShowEnd: props.shouldShowEnd || true
        }
    }

    onDateTimeSelected = (field: keyof StorageValue) => (timestamp: Date) =>
    {
        if(this.base)
        {   this.base.onValueChange({[field]: {$set: timestamp}});}
    }

    onInterruptionTypeSelected = (_: string, index: number, options: Array<SelectOption>) =>
    {
        if(this.base)
        {
            const id = options[index].id;
            const type = InterruptionType.fromDatabaseId(id)!;
            this.base.onValueChange({type: {$set: type}});
        }
    }

    componentWillReceiveProps = (nextProps: DialogInterruptionEdit_Props) =>
    {
        if(this.props.shouldShowEnd != nextProps.shouldShowEnd)
        {   this.setState({shouldShowEnd: nextProps.shouldShowEnd || this.state.shouldShowEnd});}
    }

    onValueValidation = (storageValue: StorageValue) => 
    {
        if(storageValue.start == null || storageValue.start == undefined)
        {   return "Please select a start time for the interruption.";}

        if(storageValue.end == null || storageValue.end == undefined)
        {   return "Please select an end time for the interruption.";}

        if(storageValue.end < storageValue.start)
        {   return "The end of the interruption cannot be before the start of the interruption.";}

        if(storageValue.previous && storageValue.start.getTime() < (storageValue.previous.timestamp.getTime() + (storageValue.previous.duration || 0)))
        {
            const date = new Date(storageValue.previous.timestamp.getTime() + (storageValue.previous.duration || 0));
            const previousTime = "on " + UtilityTime.dateToString(date) + " at " + UtilityTime.dateToHHMM(date);
            return "The start of the interruption cannot be before the end of the previous interruption in line (" + previousTime + ").";
        }

        if(storageValue.next && storageValue.end > storageValue.next.timestamp)
        {
            const date = new Date(storageValue.next.timestamp);
            const nextTime = "on " + UtilityTime.dateToString(date) + " at " + UtilityTime.dateToHHMM(date);
            return "The end of the interruption cannot be after the start of the next interruption in line (" + nextTime + ").";
        }

        return undefined;
    }
 
    setShouldShowEnd(shouldShowEnd: boolean) 
    {   this.setState({shouldShowEnd: shouldShowEnd});}

    getSpinnerOptions = (): Array<SelectOption> =>
    {   return InterruptionType.Values.map(type  => {return {value: type.title, id: type.dbId}});}

    getErrorComponent = () =>
    {
        if(this.base == undefined)
        {   return null;}

        return <InputError error={this.base.getCurrentError()} />
    }

    getDialogContent = (storageValue: StorageValue, error: string | undefined) => 
    {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.fieldTitle}>Timestamp Start</Text>
                <InputDateTimeSeparate style={styles.field_start} onSelected={this.onDateTimeSelected("start")} timestamp={storageValue.start || new Date()} />
                
                {this.state.shouldShowEnd && 
                <View>
                    <Text style={styles.fieldTitle2}>Timestamp End</Text>
                    <InputDateTimeSeparate style={styles.field_end} onSelected={this.onDateTimeSelected("end")} timestamp={storageValue.end || new Date()} />
                    <InputError error={error} />
                </View>
                }

                <Text style={styles.fieldTitle3}>Type</Text>
                <Dropdown data={this.getSpinnerOptions()} onChangeText={this.onInterruptionTypeSelected} value={storageValue.type.title} />
            </View>
        );
    }

    render()
    {
        return (
            <AbstractPreferenceDialog ref={onBaseReference(this)} onInternalValueValidation={this.onValueValidation} getDialogContent={this.getDialogContent} {...this.props}/>
        );
    }
}  