import React from "react";
import {View, PixelRatio} from "react-native";
import PropTypes from "prop-types";
import Theme from "../../styles/Theme";
import {Text} from "react-native-paper";
import { PARAM_NAME_SUBTITLE } from "./Router";

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
    {
        super(props);

        this.state = {
            left: this.props.left,
            right: this.props.right,
            title: this.props.title,
            subtitle: this.props[PARAM_NAME_SUBTITLE]
        }

        console.log("CustomHeaderConstructor: " + props[PARAM_NAME_SUBTITLE]);
    }

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

    componentWillReceiveProps(props) 
    {   
        console.log("componentWillReceiveProps: " + props.subtitle);
        this.setState({left: props.left, right: props.right, title: props.title, subtitle: props.subtitle});
    }

    render() 
    {
        return (
            <View style={styles.wrapper}>

                {this.state.left && 
                    <View style={styles.left}>
                        {this.state.left}
                    </View>
                }

                <View style={this.getMidStyles()}>
                    <Text numberOfLines={1} style={styles.title}>{this.state.title}</Text>
                    {this.state.subtitle && <Text numberOfLines={1} style={styles.subtitle}>{this.state.subtitle}</Text>}
                </View>

                {this.state.right && 
                    <View style={styles.right}>
                        {this.state.right}
                    </View>
                }

            </View>
        );
    }
}