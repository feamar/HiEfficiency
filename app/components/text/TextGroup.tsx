import React, {Component} from "react";
import {View, StyleSheet} from "react-native";
import { Text} from "react-native-paper";
import Theme from "../../styles/Theme";


const styles = StyleSheet.create({
    title: {
        color: Theme.colors.primary,
        paddingTop: 15,
        paddingBottom: 15
    }
});

interface Props
{
    title: string
}

interface State
{
    title: string
}

export default class TextGroup extends Component<Props, State>
{
    constructor(props: Props) 
    {
        super(props);
        this.state = {
            title: this.props.title
        }
    }

    render() {
        return (
            <View>
                <Text style={styles.title}>{this.state.title}</Text>
                {this.props.children}
            </View>
        );
    }
}