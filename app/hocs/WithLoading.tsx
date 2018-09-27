import React from "react";
import {View, StyleSheet} from "react-native";
import withStaticFields from "./WithStaticFields";
import Theme from "../styles/Theme";
import * as Progress from 'react-native-progress';

const styles = StyleSheet.create({
    wrapper:{
        height: "100%",
        width: "100%"
    },
    loading_wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%"
    },
    loader: {

    }
});

interface InjectedProps
{
    setLoading: (loading: boolean) => void
}

interface HocState 
{
    loading: boolean
}

interface HocProps
{

}

export default <P extends InjectedProps> (WrappedComponent: React.ComponentType<P>) =>
{
    const hoc = class WithLoading extends React.Component<HocProps, HocState>
    {
        constructor(props: HocProps)
        {
            super(props);

            this.state = 
            {   loading: true}
        }

        render()
        {
            return (
                <View style={styles.wrapper}>
                    {this.state.loading && <View style={styles.loading_wrapper}>
                        <Progress.Circle color={Theme.colors.primary} size={45} indeterminate={true} style={styles.loader} borderWidth={3} />
                    </View>}
                    <WrappedComponent setLoading={(loading => this.setState({loading: loading}))} {...this.props} />
                </View>
            );
        }
    }
    
    return withStaticFields(WrappedComponent, hoc);
}