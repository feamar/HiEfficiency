import React, {Component} from "react";
import { DrawerItems, SafeAreaView } from 'react-navigation';
import Theme from "../../styles/Theme";
import { View, ScrollView, Image, PixelRatio} from "react-native";
import {Text, TouchableRipple, Divider} from "react-native-paper";
import VersionNumber from 'react-native-version-number';
import FirebaseAdapter from "../firebase/FirebaseAdapter";

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
        color: Theme.colors.header.typography.subtitle
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
        console.log("PROOOPS: " + JSON.stringify(JSON.decycle(props)));
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
                {this.state.subtitle && <Text style={styles.subtitle}>{this.state.subtitle}</Text>}
            </View> 
        );
    }
}
  