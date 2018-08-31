import React, {Component} from  "react";
import {View} from "react-native";
import PropTypes from "prop-types";
import Icon  from "react-native-vector-icons/MaterialIcons";
import {TouchableRipple, Text} from "react-native-paper";
import Theme from "../../../styles/Theme";



export default class ButtonSquare extends Component
{
    constructor(props)
    {
        super(props);
    } 

    getStyles = () =>
    {
        const styles = {
   
            wrapper:
            {
                width: "100%",
                flexGrow: 1
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
        }

        styles.wrapper.borderRadius = this.props.buttonSize / 2;
        styles.wrapper.width = this.props.buttonSize;
        styles.wrapper.height = this.props.buttonSize;

        //console.log(JSON.stringify(this.props));
        //console.log(JSON.stringify(styles)); 
 
        return styles;
    } 

    render()
    {
        const styles = this.getStyles();
        return ( 
            <View style={styles.wrapper}>
                <TouchableRipple style={styles.background} theme={Theme} onPress={this.props.onPress}>
                    <View style={styles.buttonWrapper}>
                        <Icon style={styles.icon} size={this.props.iconSize} name={this.props.iconName} color={this.props.iconColor} />
                        <Text style={styles.title}>{this.props.title}</Text>
                    </View>
                </TouchableRipple>
            </View>
        );
    }
}

ButtonSquare.defaultProps = {
    buttonSize: 56,
    iconSize: 20,
}

ButtonSquare.propTypes = {
    buttonSize: PropTypes.number,
    iconSize: PropTypes.number,
    iconName: PropTypes.string.isRequired,
    iconColor: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
}