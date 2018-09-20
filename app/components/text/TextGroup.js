import React, {Component} from "react";
import {View} from "react-native";
import { Text} from "react-native-paper";
import PropTypes from "prop-types";
import Theme from "../../styles/Theme";


const styles = {
    title: {
        color: Theme.colors.primary,
        paddingTop: 15,
        paddingBottom: 15
    }
}

export default class TextGroup extends Component
{
    constructor(props) 
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

TextGroup.propTypes = {
    title: PropTypes.string.isRequired
}