import React from "react";
import TextGroup from "../text/TextGroup";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    root: {
        margin: 20
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
    render()
    {
        return(
            <View style={styles.root}>
                <TextGroup title="Privacy Statement"> 
                
                </TextGroup>
                <TextGroup title="Third Party Software"> 
                
                </TextGroup>
            </View>
        );
    }
}