import React from "react";
import withStaticFields from "./WithStaticFields"
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from './AbstractHigherOrderComponent';
import { HiEfficiencyNavigator } from "../components/routing/RoutingTypes";
import UtilityRouter from "../utilities/UtilityRouter";
import { STACK_NAME_HOME } from "../components/routing/Router";
import { NavigationRoute } from "react-navigation";

interface HocProps
{   navigation: HiEfficiencyNavigator}

export interface WithDrawerInterceptorFunctions
{
    onDrawerNavigation: (navigationTarget: NavigationRoute) => boolean
}

export default <B extends ConcreteComponent, C extends ConcreteOrHigher<B, C, WithDrawerInterceptorFunctions, P>, P> (WrappedComponent: ConcreteOrHigherConstructor<B, C, WithDrawerInterceptorFunctions, P>) =>
{
    const hoc = class withBackButtonInterceptor extends AbstractHigherOrderComponent<B, C, WithDrawerInterceptorFunctions, P, HocProps & P>
    {
        onComponentDidMount = () =>
        {
            const base = UtilityRouter.getParentByName(this.props.navigation, STACK_NAME_HOME);
            if(base)
            {   base.setParams({onDrawerNavigation: this.onDrawerNavigation});}
        }

        onComponentWillUnmount = () =>
        {
            const base = UtilityRouter.getParentByName(this.props.navigation, STACK_NAME_HOME);
            if(base)
            {   base.setParams({onDrawerNavigation: undefined});}
        }
        
        onDrawerNavigation = (navigationTarget: NavigationRoute) =>
        {
            const results: Array<boolean> = this.forEachWrappedComponent(componentOrHoc => 
            {
                if(componentOrHoc.onDrawerNavigation != undefined)
                {   
                    const handled = componentOrHoc.onDrawerNavigation(navigationTarget);
                    return handled;

                }
                return false;
            });

            const wasHandled = results.some(e => e == true);
            return wasHandled;
        }

        render()
        {   
            return <WrappedComponent ref={this.onReference} {...this.props} />
        }
    }

    return withStaticFields(WrappedComponent, hoc);
}