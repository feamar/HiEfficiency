import React from "react";
import {View, PixelRatio} from "react-native";
import PropTypes from "prop-types";
import Theme from "../../styles/Theme";
import {Text} from "react-native-paper";

const styles = {
    wrapper:{
        minHeight: 56,
        backgroundColor: Theme.colors.primary,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    left:{
        paddingLeft: 15,
        paddingRight: 15
    },
        right: {
        paddingLeft: 15,
    },
    title:{ 
        color: Theme.colors.header.typography.title,
        fontWeight: "bold",
        fontSize: 18
    },
    subtitle:{
        color: Theme.colors.header.typography.subtitle,
        fontSize: 13
    }
}
   
export default class CustomHeader extends React.Component
{
    constructor(props)
    {   super(props);}

    getMidStyles = () => 
    {
        var style = {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        };

        if(this.props.left == undefined)
        {   style.paddingLeft = 15;}

        return style;
    }

    render() 
    {
        return (
            <View style={styles.wrapper}>

                {this.props.left && 
                    <View style={styles.left}>
                        {this.props.left}
                    </View>
                }

                <View style={this.getMidStyles()}>
                    <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
                    {this.props.subtitle && <Text numberOfLines={1} style={styles.subtitle}>{this.props.subtitle}</Text>}
                </View>

                {this.props.right && 
                    <View style={styles.right}>
                        {this.props.right}
                    </View>
                }

            </View>
        );
    }
}