import React from "react";
import { Baseable, onBaseReference } from "../../../render_props/Baseable";
import AbstractContainedPreference, { AbstractContainedPreference_Props_Virtual } from "./AbstractContainedPreference";
import { AbstractPreferenceState } from "./AbstractPreference";
import { Text, Checkbox } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import Theme from "../../../styles/Theme";
import update from "immutability-helper";

const styles = StyleSheet.create({
    wrapper:
    {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 20,
        paddingRight: 20
    },
    text: {
        color: Theme.colors.typography.subtitleDark,
        marginRight: 7
    }
});

type StorageValue = PreferenceCheckbox_StorageValue;
export interface PreferenceCheckbox_StorageValue
{
    checked: boolean
}

interface Props extends AbstractContainedPreference_Props_Virtual<StorageValue>
{
    textChecked: string,
    textUnchecked?: string
}

interface State
{
    textChecked: string,
    textUnchecked?: string
}

export default class PreferenceCheckbox extends React.Component<Props, State> implements Baseable<AbstractContainedPreference<StorageValue>>
{
    public base: AbstractContainedPreference<StorageValue> | undefined;
    constructor(props: Props) 
    {
        super(props);

        this.state = {
            textChecked: props.textChecked,
            textUnchecked: props.textUnchecked
        }
    }

    getTextFromState = (state: State, checked: boolean) =>
    {
        if(checked || state.textUnchecked == undefined)
        {   return state.textChecked;}
        else
        {   return state.textUnchecked;}
    }

    getAdditionalDisplayContent = (state: AbstractPreferenceState<StorageValue>) =>
    {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.text}>{this.getTextFromState(this.state, state.storageValue.checked)}</Text>
                <Checkbox status={state.storageValue.checked ? "checked" : "unchecked"}/>
            </View>
        );
    }

    onPreferencePress = () =>
    {
        if(this.base && this.base.base)
        {
            const current = this.base.base.getStorageValue();
            const next = update(current, {checked: {$set: !current.checked}});
            this.base.base.onValueChanged(next);
        }
    }
    

    satisfiesRequired = (storageValue: StorageValue) =>
    {   return storageValue.checked;}

    render ()
    {   return <AbstractContainedPreference onPreferencePress={this.onPreferencePress} satisfiesRequired={this.satisfiesRequired} ref={onBaseReference(this)} getAdditionalDisplayContent={this.getAdditionalDisplayContent} toDisplayValue={(storageValue: StorageValue) => this.getTextFromState(this.state, storageValue.checked)} {...this.props} />}
}