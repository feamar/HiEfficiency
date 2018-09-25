import React from "react";
import {Component} from "react";
import {FAB} from "react-native-paper";
import { withTheme } from 'react-native-paper';
import update from "immutability-helper";
import Color from "../../dtos/color/Color";

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
    style: any
}

type Props = 
{
    icon: string,
    color: Color,
    enabled: boolean,
    style: any,
    onPress?: () => void,
    innerRef?: (fab: Component) => void,
    shouldHaveBottomMargin: boolean
}

class InputFloatingActionButton extends Component<Props, State>
{
    public static defaultProps: Partial<Props> = 
    {
        color: Color.fromName("white"),
        shouldHaveBottomMargin: false
    }
    handelingPress: boolean;

    constructor(props: Props)
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
    
    componentWillReceiveProps = (props: Props) : void =>
    {   this.setState({icon: props.icon, color: props.color, enabled: props.enabled, style: props.style});}

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

    onReference = (reference: Component) : void =>
    {
        if(this.props.innerRef != undefined)
        {   this.props.innerRef(reference);}
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
        console.log("RENDERING");
        return (
            <FAB ref={this.onReference} disabled={this.state.enabled == false} style={this.getFabStyles(styles.fab)} icon={this.state.icon} color={this.state.color}  onPress={this.onPress} />
        );
    }
}

const hoc1 = withTheme(InputFloatingActionButton);
export default hoc1;