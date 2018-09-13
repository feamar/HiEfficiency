import React, {Component} from "react";
import Theme from "../../styles/Theme";
import { View} from "react-native";
import {Text} from "react-native-paper";

const styles = {
    root:{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    title:{ 
        color: Theme.colors.header.typography.title,
        fontWeight: "bold",
        fontSize: 18
    },
    subtitle:{
        color: Theme.colors.header.typography.subtitle,
    }
}
   
export default class CustomHeaderTitle extends Component
{
    constructor(props) 
    {
        super(props);

        this.state = {
            title: this.props.title,
            subtitle: this.props.subtitle
        }
    }

    componentWillReceiveProps = (props) =>
    {
        this.setState({
            title: props.title,
            subtitle: props.subtitle
        })
    }
    render()
    {
        return (  
            <View style={styles.root}>   
                <Text style={styles.title}>{this.state.title}</Text>
                {this.state.subtitle && <Text numberOfLines={1} style={styles.subtitle}>{this.state.subtitle}</Text>}
            </View> 
        );
    }
}
  