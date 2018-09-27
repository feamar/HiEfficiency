import hoistNonReactStatics from 'hoist-non-react-statics/dist/hoist-non-react-statics.cjs';
import React from "react";

export default (source: React.ComponentType<any>, target: React.ComponentType<any>) =>
{   return hoistNonReactStatics(target, source);}
