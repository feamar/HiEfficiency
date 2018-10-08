import React, {Component} from  "react";
import {View, StyleSheet} from "react-native";
import Icon  from "react-native-vector-icons/MaterialIcons";
import {TouchableRipple} from "react-native-paper";
import Theme from "../../../styles/Theme";
import Color from "../../../dtos/color/Color";

interface Props
{
    buttonSize?: number,
    onPress: () => void,
    iconSize?: number,
    iconName: string,
    iconColor: Color
}

interface State
{
    buttonSize: number,
    iconSize: number,
    iconName: string,
    iconColor: Color
}



export default class ButtonCircular extends Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state = 
        {
            buttonSize: props.buttonSize || 56,
            iconSize: props.iconSize || 32,
            iconName: props.iconName,
            iconColor: props.iconColor
        }
    }

    getStyles = () =>
    {
        const styles = StyleSheet.create({
   
            wrapper: 
            {
               borderRadius: this.state.buttonSize / 2,
               width: this.state.buttonSize,
               height: this.state.buttonSize
            },
            background: {
                borderRadius: 75,
                width: "100%", 
                height: "100%",
                backgroundColor: "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            },
            icon: {
            }
        });

        return styles;
    }

    render()
    {
        const styles = this.getStyles();
        return (
            <View style={styles.wrapper}>
                <TouchableRipple style={styles.background} theme={Theme} onPress={this.props.onPress} borderless={true}>
                    <Icon style={styles.icon} size={this.state.iconSize} name={this.state.iconName} color={this.state.iconColor.toHexadecimal()} />
                </TouchableRipple>
            </View>
        );
    }
}
