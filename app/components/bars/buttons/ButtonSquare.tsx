import React, {Component} from  "react";
import {View, StyleSheet} from "react-native";
import Icon  from "react-native-vector-icons/MaterialIcons";
import {TouchableRipple, Text} from "react-native-paper";
import Theme from "../../../styles/Theme";
import Color from "../../../dtos/color/Color";

interface Props
{
    buttonSize?: number,
    onPress: () => void,
    iconSize?: number,
    iconName: string,
    iconColor: Color,
    title: string
}

interface State
{
    buttonSize: number,
    iconSize: number,
    iconName: string,
    iconColor: Color,
    title: string
}



export default class ButtonSquare extends Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state = 
        {
            buttonSize: props.buttonSize || 56,
            iconSize: props.iconSize || 20,
            iconName: props.iconName,
            iconColor: props.iconColor,
            title: props.title
        }
    } 

    getStyles = () =>
    {
        const styles =  StyleSheet.create({
   
            wrapper:
            {
                flexGrow: 1,
                borderRadius: this.state.buttonSize / 2,
                width: this.state.buttonSize,
                height: this.state.buttonSize
            },
            background: {
                width: "100%", 
                height: "100%",
                backgroundColor: "transparent",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            },
            buttonWrapper:
            {
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            },
            icon: {
            },
            title:
            {
                color: "white"
            }
        });

        return styles;
    } 

    render()
    {
        const styles = this.getStyles();
        return ( 
            <View style={styles.wrapper}>
                <TouchableRipple style={styles.background} theme={Theme} onPress={this.props.onPress}>
                    <View style={styles.buttonWrapper}>
                        <Icon style={styles.icon} size={this.state.iconSize} name={this.state.iconName} color={this.state.iconColor} />
                        <Text style={styles.title}>{this.state.title}</Text>
                    </View>
                </TouchableRipple>
            </View>
        );
    }
}