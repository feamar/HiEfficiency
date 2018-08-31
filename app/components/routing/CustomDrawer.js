import React, {Component} from "react";
import { DrawerItems, SafeAreaView } from 'react-navigation';
import Theme from "../../styles/Theme";
import { View, ScrollView, Image, PixelRatio} from "react-native";
import {Text, TouchableRipple, Divider} from "react-native-paper";
import VersionNumber from 'react-native-version-number';
import FirebaseAdapter from "../firebase/FirebaseAdapter";

const styles = {
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
    }
}
  
export default class CustomDrawer extends Component
{

    onNavigationItemPressed = (route) => () =>
    { 
        this.props.navigation.navigate(route.key);  
    }

    getItemStyle = () =>
    {
        const styles = 
        {
            touchable:
            { 
                flexDirection: "row",
                padding: 20
            },
            title:
            {
            }
        } 

        return styles;
    }

    getNavigationItem = (route) =>
    {
        const styles = this.getItemStyle();
        const active = this.props.activeItemKey == route.key;
        
        if(active)
        {
            styles.touchable.backgroundColor = Theme.colors.selectedBackground;
            styles.title.color = Theme.colors.primary;
            styles.title.fontWeight = "bold"; 
        }

        return (
            <View key={route.key}>
                <TouchableRipple disabled={active} style={styles.touchable} onPress={this.onNavigationItemPressed(route)}>
                    <Text style={styles.title}>{route.key}</Text>
                </TouchableRipple>
            </View>
        );
    }

    getEventItem = (title, onPress) =>
    {
        const styles = this.getItemStyle();

        return (
            <View>
                <TouchableRipple style={styles.touchable} onPress={onPress}> 
                    <Text>{title}</Text>
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
                    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                    {this.props.navigation.state.routes.map(route => {   return this.getNavigationItem(route);})}
                    <Divider />
                    {this.getEventItem("Logout", () => {FirebaseAdapter.logout()})}
                    </SafeAreaView> 
                </ScrollView>
                <Text style={styles.version}>Version {VersionNumber.appVersion}</Text>
            </View> 
        );
    }
}

//<DrawerItems activeTintColor={Theme.colors.primary} activeBackgroundColor={Theme.colors.selectedBackground} {...this.props} />
  