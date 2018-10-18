import React from "react";
import {Component} from "react";
import {FAB} from "react-native-paper";
import update from "immutability-helper";
import Color from "../../dtos/color/Color";
import { ViewStyle } from "react-native";

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

type State = 
{
    icon: string,
    color: Color,
    enabled: boolean,
    style?: ViewStyle,
    shouldHaveBottomMargin: boolean
}

type Props = 
{
    icon: string,
    color?: Color,
    enabled: boolean,
    style?: ViewStyle,
    onPress?: () => void,
    innerRef?: (fab: FAB | undefined) => void,
    shouldHaveBottomMargin?: boolean
}

export default class InputFloatingActionButton extends Component<Props, State>
{
    private handelingPress: boolean;

    constructor(props: Props)
    {
        super(props);

        this.state = {
            icon: props.icon,
            color: props.color || Color.fromName("white")!,
            enabled: props.enabled,
            style: props.style,
            shouldHaveBottomMargin: props.shouldHaveBottomMargin || false
        }

        this.handelingPress = false;
    }
    
    componentWillReceiveProps = (props: Props) : void =>
    {   this.setState({icon: props.icon, color: props.color || Color.fromName("white")!, enabled: props.enabled, style: props.style, shouldHaveBottomMargin: props.shouldHaveBottomMargin || false});}

    onPress = () : void =>
    {
        if(this.handelingPress)
        {   return;}

        this.handelingPress = true;
        if(this.state.enabled == false)
        {   
            this.handelingPress = false;
            return;
        }

        if(this.props.onPress != undefined)
        {   this.props.onPress();}

        this.handelingPress = false;
    }

    onReference = (reference: FAB | null) : void =>
    {
        if(this.props.innerRef != undefined)
        {   this.props.innerRef(reference == null ? undefined : reference);}
    }

    getFabStyles = (style: any) =>
    {
        var newStyle = style;
        if(this.props.shouldHaveBottomMargin)
        {   newStyle = update(style, {marginBottom: {$set: 76}})}

        return newStyle;
    }

    render()
    {
        return (
            <FAB ref={this.onReference} disabled={this.state.enabled == false} style={this.getFabStyles(styles.fab)} icon={this.state.icon} color={this.state.color.toHexadecimal()}  onPress={this.onPress} />
        );
    }
}