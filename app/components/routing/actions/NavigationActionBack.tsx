
import React from "react";
import { HiEfficiencyNavigator } from "../RoutingTypes";
import { withNavigation } from "react-navigation";
import { TouchableRipple } from "react-native-paper";
import Icon  from "react-native-vector-icons/MaterialIcons";

interface Props 
{
    navigation?: HiEfficiencyNavigator
}

interface State
{

}

class NavigationActionBack extends React.Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state =
        {

        }
    }

    onIconPress = () =>
    {
        const onBackClicked = this.props.navigation!.getParam("onBackClicked");
        console.log("Injection: " + onBackClicked);
        if(onBackClicked == undefined)
        {
            this.props.navigation!.pop();
            return;
        }
    
        const handled = onBackClicked(); 
        if(handled == false)
        {   this.props.navigation!.pop();}
    }

    render() 
    {
        return (
            <TouchableRipple onPress={this.onIconPress}><Icon size={26} name= "arrow-back" color="white" /></TouchableRipple>
        );
    }
}

export default withNavigation(NavigationActionBack);