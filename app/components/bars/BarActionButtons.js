import React, {Component} from "react";
import {View, PixelRatio} from "react-native";
import PropTypes from "prop-types";
import Theme from "../../styles/Theme"

const styles = {
    container: {
        backgroundColor: Theme.colors.primary,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        
        shadowColor:"#000000",
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        shadowOffset: {width: 0,height: 2}
    }
}

export default class BarActionButtons extends Component
{
    render()
    {
        return (
            <View style={styles.container}>
                {this.props.children}
            </View>
        );
    }
} 


BarActionButtons.propTypes =  
{

}