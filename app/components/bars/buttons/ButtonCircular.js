import React, {Component} from  "react";
import {View} from "react-native";
import PropTypes from "prop-types";
import Icon  from "react-native-vector-icons/MaterialIcons";
import {TouchableRipple} from "react-native-paper";
import Theme from "../../../styles/Theme";



export default class ButtonCircular extends Component
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
                <TouchableRipple style={styles.background} theme={Theme} onPress={this.props.onPress} borderless={true}>
                    <Icon style={styles.icon} size={this.props.iconSize} name={this.props.iconName} color={this.props.iconColor} />
                </TouchableRipple>
            </View>
        );
    }
}

ButtonCircular.defaultProps = {
    buttonSize: 56,
    iconSize: 32,
}

ButtonCircular.propTypes = {
    buttonSize: PropTypes.number,
    iconSize: PropTypes.number,
    iconName: PropTypes.string.isRequired,
    iconColor: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
}