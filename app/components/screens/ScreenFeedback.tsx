import React from "react";
import PreferenceCategory from "../preferences/PreferenceCategory";
import PreferenceSelectList from "../preferences/field/PreferenceSelectList";
import SelectOption from "../../dtos/options/SelectOption";
import {DialogPreferenceSelect_StorageValue as About} from "../dialog/preferences/DialogPreferenceSelect";
import {DialogPreferenceText_StorageValue as Details} from "../dialog/preferences/DialogPreferenceText";
import PreferenceText from "../preferences/field/PreferenceText";
import  { PreferenceCheckbox_StorageValue as Permission} from "../preferences/field/PreferenceCheckbox";
import InputFloatingActionButton from "../inputs/InputFloatingActionButton";
import { ToastAndroid, StyleSheet, View } from "react-native";
import email from 'react-native-email'

const styles = StyleSheet.create({
    screen: {
        height: "100%"
    }
});
interface Props
{

}

interface State
{
    about: About,
    details: Details,
    permission: Permission,
    fabEnabled: boolean
}

export default class ScreenFeedback extends React.Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state ={
            about:{   selected: SelectOption.FEEDBACK[0]},
            details:{   text: ""},
            permission: {   checked: false},
            fabEnabled: false
        }
    }


    onAboutSelected = (storageValue: About) =>
    {   this.setState({about: storageValue, fabEnabled: true});}

    onDetailsChanged = (storageValue: Details) =>
    {   this.setState({details: storageValue, fabEnabled: true});}

    onPermissionChanged = (storageValue: Permission) =>
    {   this.setState({permission: storageValue, fabEnabled: true});}


    getInputValidationError = (state: State) =>
    {
        if(state.details.text == undefined || state.details.text == "")
        {   return "Please enter a description detailing your feedback first.";}

        return undefined;
    }

    getBody = async (about: About, _permission: Permission, details: Details) =>
    {
        var result = "About: " + about.selected.value + "\n\n"+ 
                     "Details: " + details.text!.toString() +"\n\n";

                     /*
        if(permission.checked)
        {
            const addSafe = (accrued: string, closure: () => string) =>
            {
                try
                {   return accrued + closure();}
                catch(e)
                {   console.trace(e);}

                return accrued;
            }

            result = addSafe(result, () => "Device Information: \n\n");
            result = addSafe(result, () => "API Level: " + DeviceInfo.getAPILevel() + "\n");
            result = addSafe(result, () => "Brand: " + DeviceInfo.getBrand() + "\n");
            result = addSafe(result, () => "Build Number: " + DeviceInfo.getBuildNumber() + "\n");            
            result = addSafe(result, () => "Locale: " + DeviceInfo.getDeviceLocale() + "\n");
            result = addSafe(result, () => "Device Name: " + DeviceInfo.getDeviceName() + "\n");
            result = addSafe(result, () => "Free Disk Storage: " + DeviceInfo.getFreeDiskStorage() + "\n");
            result = addSafe(result, () => "Manufacturer: " + DeviceInfo.getManufacturer() + "\n");
            result = addSafe(result, () => "Maximum Memory: " + DeviceInfo.getMaxMemory() + "\n");
            result = addSafe(result, () => "Model: " + DeviceInfo.getModel() + "\n");
            result = addSafe(result, () => "System: " + DeviceInfo.getSystemName() + "\n");
            result = addSafe(result, () => "System Version: " + DeviceInfo.getSystemVersion() + "\n");
            result = addSafe(result, () => "Timezone: " + DeviceInfo.getTimezone() + "\n");
            result = addSafe(result, () => "Version: " + DeviceInfo.getVersion() + "\n");
        }*/

        return result;
    }

    onFabPressed = async () =>
    {
        this.setState({fabEnabled: false});
        const validationError = this.getInputValidationError(this.state);
        if(validationError)
        {
            ToastAndroid.show(validationError, ToastAndroid.LONG);
            this.setState({fabEnabled: true});
            return;
        }

        const body = await this.getBody(this.state.about, this.state.permission, this.state.details);
        await this.sendFeedback(body);

        this.setState({fabEnabled: true});
    }

    sendFeedback = (body: string): Promise<void> =>
    {
        const to = ["info@hi-efficiency.net"];
        return email(to, {subject: "I'd like to give you guys some feedback!", body: body})
        .catch((error: Error) => 
        {
            console.trace(error);
            ToastAndroid.show("Something went wrong while trying to open the e-mail manager. Please try again later.", ToastAndroid.LONG);
        });
    }

    render () 
    {
        return(
            <View style={styles.screen}>
                <PreferenceCategory title="Feedback">
                    <PreferenceSelectList required title="About" options={SelectOption.FEEDBACK} storageValue={this.state.about} onValueChanged={this.onAboutSelected} />
                    <PreferenceText required multiline={true} numberOfLines={10} title="Details" label="Details" storageValue={this.state.details} onValueChanged={this.onDetailsChanged} />
                </PreferenceCategory>
                <InputFloatingActionButton icon="send" enabled={this.state.fabEnabled} onPress={this.onFabPressed} />
            </View>
        );   
    }

}


/*<PreferenceCategory title="Permission">
    <PreferenceCheckbox onValueChanged={this.onPermissionChanged} storageValue={this.state.permission} title="Personal Information" textChecked="Send device information, such as version and build numbers, along with my feedback."/>
</PreferenceCategory>*/