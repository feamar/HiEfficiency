import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, Circle } from "react-native-svg";
import Theme from "../../../styles/Theme";
import TimelineConstants from "../TimelineConstants";

const styles = StyleSheet.create({
    root:{
    }
});

interface Props 
{

}

interface State {

}

export default class PartialSkipLine extends React.Component<Props, State>
{
    render()
    {
        return (
            <View style={styles.root}>
                <Svg width="40" height={TimelineConstants.SKIP_HEIGHT} viewBox="0 0 80 80" >
                    <Circle cx="40" cy="0"  r="6"  fill={Theme.colors.primaryLight} stroke="none" />
                    <Circle fillOpacity={TimelineConstants.SKIP_OPACITY} cx="40" cy="20" r="6" fill={Theme.colors.primaryLight} stroke="none"/>
                    <Circle fillOpacity={TimelineConstants.SKIP_OPACITY} cx="40" cy="40" r="6" fill={Theme.colors.primaryLight} stroke="none"/>
                    <Circle fillOpacity={TimelineConstants.SKIP_OPACITY} cx="40" cy="60" r="6" fill={Theme.colors.primaryLight} stroke="none"/>
                    <Circle cx="40" cy="80" r="6"  fill={Theme.colors.primaryLight} stroke="none" />
                </Svg>
            </View>            
        );
    }
}