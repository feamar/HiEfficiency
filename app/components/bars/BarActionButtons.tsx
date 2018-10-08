import React, {Component} from "react";
import {View, StyleSheet} from "react-native";
import Theme from "../../styles/Theme"

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.colors.primary,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        
        shadowColor:"#000000",
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        shadowOffset: {width: 0,height: 2}
    }
});

interface Props
{

}

interface State
{

}

export default class BarActionButtons extends Component<Props, State>
{
    render()
    {
        return (
            <View style={styles.container}>
                {this.props.children}
            </View>
        );
    }
} 