import React, {Component} from "react";
import { DrawerItems, SafeAreaView } from 'react-navigation';
import Theme from "../../styles/Theme";
import { View, ScrollView} from "react-native";
import {Text} from "react-native-paper";
import VersionNumber from 'react-native-version-number';
 
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
    }
}
  
export default class CustomDrawer extends Component
{
    render()
    {
        return ( 
            <View style={styles.root}> 
                <ScrollView style={styles.scrollView}>
                    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                        <DrawerItems activeTintColor={Theme.colors.primary} activeBackgroundColor={Theme.colors.selectedBackground} {...this.props} />
                    </SafeAreaView>
                </ScrollView>
                <Text style={styles.version}>Version {VersionNumber.appVersion}</Text>
            </View>
        );
    }
}

  