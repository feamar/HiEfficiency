import React, {Component} from "react";
import{View} from "react-native";
import {FAB} from "react-native-paper";
import PropTypes from "prop-types";
import UtilityColor from "../../utilities/UtilityColor";
import { withTheme } from 'react-native-paper';
import update from "immutability-helper";

var styles = {
    fab:
    {
        position: "absolute",
        right: 0,
        bottom: 0,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        marginRight: 20,
        marginBottom: 20
    }
}

class InputFloatingActionButton extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            icon: props.icon,
            color: props.color,
            enabled: props.enabled,
            style: props.style
        }

        this.handelingPress = false;
    }
    
    componentWillReceiveProps(props) 
    {   this.setState({icon: props.icon, color: props.color, enabled: props.enabled, style: props.style});}

    onPress = () =>
    {
        console.log("onFabPress: " + this.handelingPress)
        if(this.handelingPress)
        {   return;}

        this.handelingPress = true;
        if(this.state.enabled == false)
        {   
            this.handelingPress = false;
            return;
        }

        if(this.props.onPress != undefined && typeof this.props.onPress === "function")
        {   
            this.props.onPress();
        }

        this.handelingPress = false;
    }

    onReference = (reference) =>
    {
        if(this.props.innerRef != undefined && typeof this.props.innerRef === "function")
        {   this.props.innerRef(reference);}
    }

    getFabStyles = (style) =>
    {
        var newStyle = style;
        if(this.props.shouldHaveBottomMargin)
        {   newStyle = update(style, {marginBottom: {$set: 76}})}

        return newStyle;
    }

    render()
    {
        console.log("RENDERING");
        return (
            <FAB ref={this.onReference} disabled={this.state.enabled == false} style={this.getFabStyles(styles.fab)} icon={this.state.icon} color={this.state.color}  onPress={this.onPress} />
        );
    }
}

InputFloatingActionButton.defaultProps = {
    color: "white",
    enabled: true
}

InputFloatingActionButton.propTypes = {
    innerRef: PropTypes.func,
    enabled: PropTypes.bool.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    style: PropTypes.any,
    shouldHaveBottomMargin: PropTypes.bool
}

const hoc1 = withTheme(InputFloatingActionButton);
export default hoc1;