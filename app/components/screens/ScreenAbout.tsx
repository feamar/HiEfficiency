import React from "react";
import TextGroup from "../text/TextGroup";
import { View, StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import { Text } from "react-native-paper";
import UtilityUrl from "../../utilities/UtilityUrl";

const styles = StyleSheet.create({
    root: {
        margin: 20
    },
    url:
    {
        color: "#0000EE",
        textDecorationLine: "underline" 
    }
});

interface Props
{

}

interface State
{

}

export default class ScreenAbout extends React.Component<Props, State>
{
    onSmashIconsLinkPressed = async () =>
    {
        const success = await UtilityUrl.goToUrl("https://smashicons.com");
        if(success == false)
        {   ToastAndroid.show("Something went wrong while trying to open the URL 'https://smashicons.com'. Please try again later.", ToastAndroid.LONG);}
    }

    render()
    {
        return(
            <View style={styles.root}>
                <TextGroup title="Privacy Statement"> 
                
                </TextGroup>
                <TextGroup title="Proprietary Licensing"> 
                    <TouchableOpacity onPress={this.onSmashIconsLinkPressed}>
                        <Text>This application uses artwork created by Smashicons, please see <Text style={styles.url}>https://smashicons.com</Text> for more information.</Text>
                    </TouchableOpacity>
                </TextGroup>
            </View>
        );
    }
}