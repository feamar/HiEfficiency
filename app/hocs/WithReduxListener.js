import React from "react";
import {View} from "react-native";
import withStaticFields from "./WithStaticFields";
import withFocusListener from "./WithFocusListener";
import AbstractHigherOrderComponent from './AbstractHigherOrderComponent';
import {connect} from 'react-redux';
import UtilityObject from "../utilities/UtilityObject";
import Theme from "../styles/Theme";
import * as Progress from 'react-native-progress';

const styles = {
    wrapper:{
        height: "100%",
        width: "100%"
    },
    loading: {
        wrapper: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%"
        },
        loader: {

        }
    }
}

export default withReduxListener = (mapStateToProps, mapDispatchToProps, WrappedComponent) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent
    {
        constructor(props)
        {
            super(props);

            this.state = {
                loading: true
            }
        }

        componentWillReceiveProps = (props) =>
        {
            console.log("WITH REDUX LISTENER - COMPONENT WILL RECEIVE PROPS");
            this.onReduxStateChanged(props);
        }

        onReduxStateChanged = (props) =>
        {
            this.callForEachListener("onReduxStateChanged", props);
        }

        render()
        {
            return (
                <View style={styles.wrapper}>
                    {this.state.loading && <View style={styles.loading.wrapper}>
                        <Progress.Circle color={Theme.colors.primary} size={45} indeterminate={true} style={styles.loading.loader} borderWidth={3} />
                    </View>}
                    <WrappedComponent setLoading={(loading => this.setState({loading: loading}))} ref={instance => this.wrapped = instance} {...this.props} />
                </View>
            );
        }
    }
    
    const hoc1 = connect(mapStateToProps, mapDispatchToProps)(hoc);
    
    return withStaticFields(WrappedComponent, hoc1);
}