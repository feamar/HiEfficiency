import React from "react";
import {View, PixelRatio} from "react-native";
import PropTypes from "prop-types";
import Theme from "../../styles/Theme";
import {Text} from "react-native-paper";

const styles = {
    wrapper:{
        minHeight: PixelRatio.getPixelSizeForLayoutSize(13),
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
    mid:{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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

    render() 
    {
        return (
            <View style={styles.wrapper}>

                {this.props.left && 
                    <View style={styles.left}>
                        {this.props.left}
                    </View>
                }

                <View style={styles.mid}>
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