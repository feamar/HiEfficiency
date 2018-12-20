import React from "react";
import { View, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
    root:{
        display: "flex",
        flexDirection: "row",
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 5,
        marginLeft: 105
    },
    filler:
    {
        flex: 1,
        flexGrow: 1,
    },
    percentage:
    {
        flexShrink: 1,
    }
});

interface Props 
{

}

interface State {

}

export default class PartialPercentages extends React.Component<Props, State>
{
    render()
    {
        return (
            <View style={styles.root}>
                <Text style={styles.percentage}>0%</Text>
                <View style={styles.filler}/>
                <Text style={styles.percentage}>100%</Text>
            </View>            
        );
    }
}