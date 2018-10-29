import React, {Component} from "react";
import { SafeAreaView, NavigationRoute, NavigationScreenProp } from 'react-navigation';
import Theme from "../../styles/Theme";
import { View, ScrollView, Image, StyleSheet} from "react-native";
import {Text, TouchableRipple, Divider} from "react-native-paper";
import VersionNumber from 'react-native-version-number';
import FirebaseAdapter from "../firebase/FirebaseAdapter";
import { CustomNavigationState, CustomNavigationParams, HiEfficiencyNavigator } from "./RoutingTypes";

var styles = StyleSheet.create({
    root:{
        height: "100%" 
    }, 
    scrollView:
    {
    }, 
    container: 
    {
        flex: 1,
    },
    version:  
    {
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        opacity: Theme.opacities.text.faded,
        padding: 20
    },
    header:
    { 
        width: "100%" 
    },
    touchable:
    { 
        flexDirection: "row",
        padding: 20,
    },
});

interface Props
{
    navigation: NavigationScreenProp<CustomNavigationState, CustomNavigationParams>,
    activeItemKey: string
}

interface State
{

}


export default class CustomDrawer extends Component<Props, State>
{
    onNavigationItemPressed = (navigation: HiEfficiencyNavigator, route: NavigationRoute) => () =>
    {
        var handled = false;
        
        const injection = navigation.getParam("onDrawerNavigation");
        if(injection)
        {
            handled = injection(route);
        }

        if(handled == false)
        {   this.props.navigation.navigate(route.key);}
    }

    getItemStyle = (active: boolean) =>
    {
        var styles = StyleSheet.create( 
        {
            touchable:
            { 
                flexDirection: "row",
                padding: 20,
                backgroundColor: active ? Theme.colors.selectedBackground : undefined 
            },
            title:
            {
                fontWeight: active ? "bold" : "normal",
                color: active ? Theme.colors.primary : undefined
            }
        });

        return styles;
    }

    getNavigationItem = (navigation: HiEfficiencyNavigator, route: NavigationRoute) =>
    {
        const active = this.props.activeItemKey == route.key;
        
        const styles = this.getItemStyle(active);

        return (
            <View key={route.key}>
                <TouchableRipple disabled={active} style={styles.touchable} onPress={this.onNavigationItemPressed(navigation, route)}>
                    <Text style={styles.title}>{route.key}</Text>
                </TouchableRipple>
            </View>
        );
    }

    getEventItem = (title: string, onPress: () => void) =>
    {
        return (
            <View>
                <TouchableRipple style={styles.touchable} onPress={onPress}> 
                    <Text style={this.getItemStyle(false).title}>{title}</Text>
                </TouchableRipple>
            </View>
        );        
    }

    render()
    {
        return (  
            <View style={styles.root}>   
                <Image style={styles.header} source={require('../../../assets/drawer_header.png')}/>
                <ScrollView style={styles.scrollView}>
                    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                    {this.props.navigation.state.routes.map(route => {   return this.getNavigationItem(this.props.navigation as HiEfficiencyNavigator, route);})}
                    <Divider />
                    {this.getEventItem("Logout", () => {FirebaseAdapter.logout()})}
                    </SafeAreaView> 
                </ScrollView>
                <Text style={styles.version}>Version {VersionNumber.appVersion}</Text>
            </View> 
        );
    }
}

  