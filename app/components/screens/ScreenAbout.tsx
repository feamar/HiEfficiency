import React from "react";
import TextGroup from "../text/TextGroup";
import { StyleSheet, ToastAndroid, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import UtilityUrl from "../../utilities/UtilityUrl";

const styles = StyleSheet.create({
    root: {
        height: "100%",
    },
    wrapper:
    {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
    },
    alineaEnd:
    {
        marginBottom: 10
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
    //TODO: Remove if it turns out this is no longer needed when the content of the About screen is settled.
    onSmashIconsLinkPressed = async () =>
    {
        const success = await UtilityUrl.goToUrl("https://smashicons.com");
        if(success == false)
        {   ToastAndroid.show("Something went wrong while trying to open the URL 'https://smashicons.com'. Please try again later.", ToastAndroid.LONG);}
    }

    render()
    {
        return(
            <ScrollView style={styles.root}>
                <View style={styles.wrapper}>
                    <TextGroup title="Your Data"> 
                        <Text>We care about your data greatly.</Text>
                        <Text style={styles.alineaEnd}>We will not sell your personal data, ever.</Text>

                        <Text>We will use your data to do analysis about process efficiency.</Text>
                        <Text>We will use your data to do aggregate analyses about process efficiency over multiple teams.</Text>
                        <Text style={styles.alineaEnd}>We will use these analyses to make anonymized publications for a PhD study (see <Text style={styles.url}>www.hi-efficiency.net/research</Text>).</Text>

                        <Text>We will provide you with insight into your process efficiency, for free.</Text>
                        <Text style={styles.alineaEnd}>We will provide you with tools that can help improve your process efficiency, for free (in the near future).</Text>

                        <Text>Your data will help both you, and the whole of the IT sector by giving us measurement based improvement.</Text>
                    </TextGroup>
                    <TextGroup title="Proprietary Licensing"> 
                        <Text>This application is developed by a small team. Since we have limited resources, we make use of work created by others. We think that's smart and efficient. We've made use of artwork created by Smashicons as well as numerous opensource libraries.</Text>
                    </TextGroup>
                </View>
            </ScrollView>
        );
    }
}