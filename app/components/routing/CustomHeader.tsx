import React from "react";
import {View, StyleSheet, ViewStyle} from "react-native";
import {Text} from "react-native-paper";
import Theme from "../../styles/Theme";
import { SafeAreaView } from "react-navigation";

const styles = StyleSheet.create({
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
});


interface Props
{
    left?: JSX.Element,
    right?: JSX.Element,
    title: string,
    subtitle?: string 
}

interface State 
{
    left?: JSX.Element,
    right?: JSX.Element,
    title: string,
    subtitle?: string 
}
   
export default class CustomHeader extends React.Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state = {
            left: this.props.left,
            right: this.props.right,
            title: this.props.title,
            subtitle: this.props.subtitle
        }
    }

    getMidStyles = () => 
    {
        var style: ViewStyle = {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 0
        };

        if(this.props.left == undefined)
        {   style.paddingLeft = 15;}

        return style;
    }

    componentWillReceiveProps(props: Props) 
    {   
        this.setState({left: props.left, right: props.right, title: props.title, subtitle: props.subtitle});
    }

    render() 
    {
        return (
            <SafeAreaView>
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
            </SafeAreaView>
        );
    }
}