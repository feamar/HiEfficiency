
import React from "react";
import { HiEfficiencyNavigator } from "../RoutingTypes";
import { TouchableRipple } from "react-native-paper";
import Icon  from "react-native-vector-icons/MaterialIcons";
import { withNavigation } from "react-navigation";

interface Props 
{
    navigation?: HiEfficiencyNavigator
}

interface State
{

}

class NavigationActionHamburger extends React.Component<Props, State>
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
        if(this.props.navigation)
        {   this.props.navigation.openDrawer();}
    }

    render() 
    {
        return (
            <TouchableRipple onPress={this.onIconPress}><Icon size={26} name= "menu" color="white" /></TouchableRipple>
        );
    }
}

export default withNavigation(NavigationActionHamburger);