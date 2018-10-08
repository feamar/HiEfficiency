import React from "react";
import {View, StyleSheet} from "react-native";
import withStaticFields from "./WithStaticFields";
import Theme from "../styles/Theme";
import * as Progress from 'react-native-progress';
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from "./AbstractHigherOrderComponent";

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

export interface WithLoadingProps
{
    setLoading: (loading: boolean) => void
}

interface HocState 
{
    loading: boolean
}

type WithLoadingPropsInner<P> = P & WithLoadingProps;
type WithLoadingPropsOuter<P> = P;

export default <B extends ConcreteComponent, C extends ConcreteOrHigher<B, C, {}, WithLoadingPropsInner<P>>, P> (WrappedComponent: ConcreteOrHigherConstructor<B, C, {}, WithLoadingPropsInner<P>>) =>
{
    const hoc = class WithLoading extends AbstractHigherOrderComponent<B, C, {}, WithLoadingPropsInner<P>, WithLoadingPropsOuter<P>, HocState>
    {
        constructor(props: WithLoadingPropsInner<P>)
        {
            super(props);

            this.state = 
            {   loading: true}
        }

        setLoading = (loading: boolean) => this.setState({loading: loading});

        render()
        {
            let passthroughProps: Readonly<P> = this.props;
            let innerProps: Readonly<WithLoadingPropsInner<P>> = Object.assign({}, passthroughProps, {setLoading: this.setLoading});

            return (
                <View style={styles.wrapper}>
                    {this.state.loading && <View style={styles.loading_wrapper}>
                        <Progress.Circle color={Theme.colors.primary} size={45} indeterminate={true} style={styles.loader} borderWidth={3} />
                    </View>}
                    <WrappedComponent {...innerProps} />
                </View>
            );
        }
    }
    
    return withStaticFields(WrappedComponent, hoc);
}